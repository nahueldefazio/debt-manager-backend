import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, SendCodeDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // ─── PASO 1: Enviar código de verificación ───────────────────────────────
  async sendVerificationCode(dto: SendCodeDto) {
    // Verificar que el email no esté ya registrado
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('El correo ya está registrado. Iniciá sesión.');
    }

    // Invalidar códigos anteriores para este email (limpieza)
    await this.prisma.verificationCode.updateMany({
      where: { email: dto.email, used: false },
      data: { used: true },
    });

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    await this.prisma.verificationCode.create({
      data: { email: dto.email, code, expiresAt },
    });

    // Enviar email
    await this.mailService.sendVerificationCode(dto.email, code);

    return { message: 'Código de verificación enviado. Revisá tu correo.' };
  }

  // ─── PASO 2: Registrar con código verificado ─────────────────────────────
  async register(dto: RegisterDto) {
    // 1. Verificar que el email no esté registrado
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('El correo ya está registrado. Iniciá sesión.');
    }

    // 2. Validar el código
    const record = await this.prisma.verificationCode.findFirst({
      where: {
        email: dto.email,
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException(
        'El código es inválido o ya expiró. Solicitá uno nuevo.',
      );
    }

    // 3. Marcar código como usado
    await this.prisma.verificationCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    // 4. Crear usuario
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        isPro: false,
      },
    });

    return this.signToken(user.id, user.email, user.isPro);
  }

  // ─── Login ────────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return this.signToken(user.id, user.email, user.isPro);
  }

  private signToken(userId: number, email: string, isPro: boolean) {
    const payload = { sub: userId, email, isPro };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: userId, email, isPro },
    };
  }
}

import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProLimitGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Asumimos que un Auth Middleware previo adjuntó el usuario al request
    // Para simplificar la demo sin auth real, simularemos el user 1
    const userId = request.user?.id || 1; 

    if (!userId) return false;

    const user = await this.prisma.user.findUnique({ 
      where: { id: userId }, 
      include: { _count: { select: { debts: true } } } 
    });
    
    if (!user) {
      // Mocking user 1 creation for demo purposes if it doesn't exist
      return true;
    }

    if (!user.isPro && user._count.debts >= 5) {
      throw new ForbiddenException('Límite de 5 deudas alcanzado. Actualiza a Pro para crear más.');
    }

    return true;
  }
}

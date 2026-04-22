import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a14; margin: 0; padding: 40px 20px; }
          .container { max-width: 480px; margin: 0 auto; background: #13132a; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
          .header { background: linear-gradient(135deg, #6c63ff 0%, #a855f7 100%); padding: 36px 40px; text-align: center; }
          .logo { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
          .logo span { opacity: 0.8; }
          .body { padding: 40px; }
          h2 { color: #f0f0ff; font-size: 20px; margin: 0 0 12px; }
          p { color: #9ca3af; font-size: 15px; line-height: 1.6; margin: 0 0 28px; }
          .code-box { background: rgba(108, 99, 255, 0.12); border: 2px solid rgba(108, 99, 255, 0.4); border-radius: 16px; padding: 28px; text-align: center; margin-bottom: 28px; }
          .code { font-size: 44px; font-weight: 800; letter-spacing: 12px; color: #a78bfa; font-family: monospace; }
          .expiry { color: #6b7280; font-size: 13px; margin: 0; }
          .footer { background: rgba(0,0,0,0.2); padding: 20px 40px; text-align: center; }
          .footer p { color: #4b5563; font-size: 12px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Debt<span>Manager</span></div>
          </div>
          <div class="body">
            <h2>Verificá tu correo electrónico</h2>
            <p>Usá el siguiente código para completar tu registro. Este código es válido por <strong style="color:#c4b5fd">10 minutos</strong>.</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p class="expiry">Si no solicitaste este código, podés ignorar este mensaje de forma segura.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DebtManager &bull; Sistema de gestión de cobros</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"DebtManager" <${process.env.MAIL_USER}>`,
        to,
        subject: `${code} es tu código de verificación — DebtManager`,
        html,
      });
    } catch (err) {
      console.error('Error enviando email:', err);
      throw new InternalServerErrorException('No se pudo enviar el correo de verificación.');
    }
  }
}

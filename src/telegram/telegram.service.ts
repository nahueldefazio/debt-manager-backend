import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { DebtsService } from '../debts/debts.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(private readonly debtsService: DebtsService) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new Telegraf(token);
    } else {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN no está definido en tu .env. El bot de Telegram no se iniciará.');
    }
  }

  onModuleInit() {
    if (!this.bot) return;

    this.bot.start((ctx) => {
      ctx.reply(
        '¡Hola! Soy tu asistente de cobranzas. Envíame un mensaje con el siguiente formato para agregar una deuda:\n\n' +
        '"Monto, Concepto, Teléfono"\n\n' +
        'Ejemplo: 15000, Diseño de Logo, 5491123456789'
      );
    });

    this.bot.on('text', async (ctx) => {
      const text = ctx.message.text;
      
      // Basic parsing by commas
      const parts = text.split(',').map(p => p.trim());
      
      if (parts.length === 3) {
        const amount = parseFloat(parts[0]);
        const description = parts[1];
        const debtorPhone = parts[2];

        if (isNaN(amount)) {
          return ctx.reply('⚠️ El monto debe ser un número válido. (Ej: 15000)');
        }

        try {
          // Asumimos userId = 1 para el usuario actual (mock)
          await this.debtsService.createDebt(1, {
            description,
            amount,
            currency: 'ARS',
            debtorPhone,
            isPaid: false,
            totalInstallments: 1
          });

          ctx.reply(`✅ Deuda guardada con éxito:\n\nConcepto: ${description}\nMonto: $${amount}\nTeléfono: ${debtorPhone}\n\nYa puedes verla en tu Panel Web.`);
        } catch (error) {
          console.error(error);
          ctx.reply('❌ Hubo un error al guardar la deuda en la base de datos.');
        }
      } else {
        ctx.reply('⚠️ Formato incorrecto.\nPor favor, utiliza estrictamente: Monto, Concepto, Teléfono\n\nEjemplo: 1500, Juan Perez, 5491123456789');
      }
    });

    this.bot.launch();
    console.log('🤖 Bot de Telegram inicializado y escuchando mensajes...');
  }
}

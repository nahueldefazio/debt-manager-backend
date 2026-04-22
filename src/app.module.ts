import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DebtsModule } from './debts/debts.module';
import { TelegramModule } from './telegram/telegram.module';
import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [PrismaModule, DebtsModule, TelegramModule, AuthModule, CurrencyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

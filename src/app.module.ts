import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DebtsModule } from './debts/debts.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [PrismaModule, DebtsModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

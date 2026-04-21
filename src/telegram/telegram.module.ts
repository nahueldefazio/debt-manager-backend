import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { DebtsModule } from '../debts/debts.module';

@Module({
  imports: [DebtsModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}

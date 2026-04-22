import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('usd')
  async getUsd() {
    const rate = await this.currencyService.getUsdRate();
    return { venta: rate };
  }

  @Get('eur')
  async getEur() {
    const rate = await this.currencyService.getEurRate();
    return { venta: rate };
  }
}

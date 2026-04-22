import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly httpService: HttpService) {}

  async getUsdRate(): Promise<number> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://dolarapi.com/v1/dolares/blue'),
      );
      return data.venta;
    } catch (error) {
      this.logger.error('Error fetching USD rate from dolarapi', error);
      return 1400; // Fallback
    }
  }

  async getEurRate(): Promise<number> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://dolarapi.com/v1/cotizaciones/eur'),
      );
      return data.venta;
    } catch (error) {
      this.logger.error('Error fetching EUR rate from dolarapi', error);
      return 1500; // Fallback
    }
  }
}

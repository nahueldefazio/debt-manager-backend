import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { ProLimitGuard } from '../guards/pro-limit.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  getActiveDebts(@Request() req) {
    return this.debtsService.getActiveDebts(req.user.id);
  }

  @Post()
  @UseGuards(ProLimitGuard)
  createDebt(@Request() req, @Body() createDebtDto: any) {
    return this.debtsService.createDebt(req.user.id, createDebtDto);
  }

  @Get(':id/whatsapp-link')
  generateWhatsAppLink(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.debtsService.generateWhatsAppLink(id, req.user.id)
      .then(link => ({ link }));
  }

  @Patch(':id')
  updateDebt(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateDebtDto: any) {
    return this.debtsService.updateDebt(id, req.user.id, updateDebtDto);
  }

  @Delete(':id')
  deleteDebt(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.debtsService.deleteDebt(id, req.user.id);
  }
}

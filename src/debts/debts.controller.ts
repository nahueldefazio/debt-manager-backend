import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { ProLimitGuard } from '../guards/pro-limit.guard';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  getActiveDebts(@Request() req) {
    const userId = req.user?.id || 1; // Mock user
    return this.debtsService.getActiveDebts(userId);
  }

  @Post()
  @UseGuards(ProLimitGuard)
  createDebt(@Request() req, @Body() createDebtDto: any) {
    const userId = req.user?.id || 1; // Mock user
    return this.debtsService.createDebt(userId, createDebtDto);
  }

  @Get(':id/whatsapp-link')
  generateWhatsAppLink(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.id || 1; // Mock user
    return this.debtsService.generateWhatsAppLink(id, userId)
      .then(link => ({ link }));
  }

  @Patch(':id')
  updateDebt(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateDebtDto: any) {
    const userId = req.user?.id || 1; // Mock user
    return this.debtsService.updateDebt(id, userId, updateDebtDto);
  }

  @Delete(':id')
  deleteDebt(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.id || 1; // Mock user
    return this.debtsService.deleteDebt(id, userId);
  }
}

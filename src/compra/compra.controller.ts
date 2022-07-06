import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Get()
  findAll() {
    return this.compraService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCompraDto) {
    return this.compraService.create(dto);
  }
}

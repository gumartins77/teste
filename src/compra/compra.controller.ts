import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@ApiTags('compra')
@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Get('/produtos')
  findAll() {
    return this.compraService.findAll();
  }

  @Get(':produtoId/parcelas')
  findAllParcerlasProduto(@Param('produtoId') produtoId: string) {
    return this.compraService.findAllParcerlasProduto(produtoId);
  }

  @Post(':produtoId')
  create(@Param('produtoId') produtoId: string, @Body() dto: CreateCompraDto) {
    return this.compraService.create(produtoId, dto);
  }
}

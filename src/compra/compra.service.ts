import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Injectable()
export class CompraService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const produtos = await this.prisma.produto.findMany({
      select: {
        id: true,
        nome: true,
        valor: true,
      },
    });

    if (produtos.length === 0) {
      throw new NotFoundException('Nenhum produto encontrado!');
    }

    return produtos
  }

  async create(dto: CreateCompraDto) {
    
    const data: Prisma.CompraCreateInput = {
      produto: {
        connect: {
          id: dto.produtoId,
        },
      },
      qtdeParcelas: dto.qtdeParcelas,
      valorEntrada: dto.valorEntrada,
    };

    const qtdeParcelas = dto.qtdeParcelas;
    const valorEntrada = dto.valorEntrada;

    const numeroParcelas = valorEntrada / qtdeParcelas;

    if (qtdeParcelas > 6) {
      const juros = valorEntrada * 0.0115;
      console.log(juros);

      const valorParcelas = valorEntrada / qtdeParcelas;
      console.log(valorParcelas);

      const taxaJurosAoMes = valorParcelas + juros;
      console.log(taxaJurosAoMes);

      const montante = qtdeParcelas * taxaJurosAoMes;
      console.log(montante);

      return {
        message: `Valor Total do Produto com Juros: R$${montante.toFixed(
          2,
        )} - Quantidade de Parcelas: ${qtdeParcelas} - Valor de cada Parcela com Juros: R$${taxaJurosAoMes.toFixed(
          2,
        )}`,
      };
    }

    return {
      message: `Valor Total do Produto: R$${valorEntrada.toFixed(
        2,
      )} - Quantidade de Parcelas: ${qtdeParcelas} - Valor de cada Parcela: R$${numeroParcelas.toFixed(
        2,
      )}`,
    };
  }
}

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

    return produtos;
  }

  async findOne(produtoId: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      throw new NotFoundException(
        `Produto com o id '${produtoId}' não foi encontrado!`,
      );
    }

    return produto;
  }

  async create(produtoId: string, dto: CreateCompraDto) {
    const produto = await this.findOne(produtoId);
    console.log(produto);

    const data: Prisma.CompraCreateInput = {
      produto: {
        connect: {
          id: produtoId,
        },
      },
      qtdeParcelas: dto.qtdeParcelas,
      valorEntrada: produto.valor,
    };

    const qtdeParcelas = dto.qtdeParcelas;
    const valorEntrada = produto.valor;
    console.log(valorEntrada);

    const numeroParcelas = valorEntrada / qtdeParcelas;
    console.log(numeroParcelas);

    if (qtdeParcelas > 6) {
      const juros = valorEntrada * 0.0115;
      console.log(juros);

      const valorParcelas = valorEntrada / qtdeParcelas;
      console.log(valorParcelas);

      const taxaJurosAoMes = valorParcelas + juros;
      console.log(taxaJurosAoMes);

      const montante = qtdeParcelas * taxaJurosAoMes;
      console.log(montante);

      await this.prisma.compra.create({ data });

      return {
        message: `Valor Total do Produto com Juros: R$${montante.toFixed(
          2,
        )} - Quantidade de Parcelas: ${qtdeParcelas} - Valor de cada Parcela com Juros: R$${taxaJurosAoMes.toFixed(
          2,
        )}`,
      };
    }

    await this.prisma.compra.create({ data });

    return {
      message: `Valor Total do Produto: R$${valorEntrada.toFixed(
        2,
      )} - Quantidade de Parcelas: ${qtdeParcelas} - Valor de cada Parcela: R$${numeroParcelas.toFixed(
        2,
      )}`,
    };
  }
}

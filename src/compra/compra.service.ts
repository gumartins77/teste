import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Injectable()
export class CompraService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const produtos = await this.prisma.produto.findMany();

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

  async findAllParcerlasProduto(produtoId: string) {
    const produto = await this.findOne(produtoId);

    const parcelas = [];

    for (var i = 1; i <= 12; i++) {
      if (i <= 6) {
        let parcela = (produto.valor / i).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        parcelas.push(parcela);
      } else if (i > 6) {
        let parcelaJuros = (
          produto.valor * 0.0115 +
          produto.valor / i
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        parcelas.push(parcelaJuros);
      }
    }

    return {
      message:
        'Veja abaixo o valor de cada parcela, atentanto-se que apartir de 6x, será cobrado uma taxa de 1,15% ao mês:',
      parcelas,
    };
  }

  async create(produtoId: string, dto: CreateCompraDto) {
    const produto = await this.findOne(produtoId);

    const qtdeParcelas = dto.qtdeParcelas;
    const valorEntrada = produto.valor;

    if (qtdeParcelas > 6) {
      const juros = valorEntrada * 0.0115;

      const valorParcelas = valorEntrada / qtdeParcelas;

      const taxaJurosAoMes = valorParcelas + juros;

      const montante = qtdeParcelas * taxaJurosAoMes;

      const data: Prisma.CompraCreateInput = {
        produto: {
          connect: {
            id: produtoId,
          },
        },
        qtdeParcelas: dto.qtdeParcelas,
        valorEntrada: montante.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        juros: '1.15%',
        precoParcelas: taxaJurosAoMes.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      };

      return await this.prisma.compra.create({
        data,
        select: {
          id: true,
          valorEntrada: true,
          qtdeParcelas: true,
          precoParcelas: true,
          juros: true,
        },
      });
    }

    const data: Prisma.CompraCreateInput = {
      produto: {
        connect: {
          id: produtoId,
        },
      },
      qtdeParcelas: dto.qtdeParcelas,
      valorEntrada: produto.valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      juros: '0%',
      precoParcelas: (produto.valor / dto.qtdeParcelas).toLocaleString(
        'pt-BR',
        { style: 'currency', currency: 'BRL' },
      ),
    };

    return await this.prisma.compra.create({
      data,
      select: {
        id: true,
        valorEntrada: true,
        qtdeParcelas: true,
        precoParcelas: true,
        juros: true,
      },
    });
  }
}

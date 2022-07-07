import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateCompraDto {
  @IsNumber()
  @Min(1, {
    message:
      'Não é permitido que o número de parcelas seja menor que 1! Por favor, digite um número válido de 1 a 12.',
  })
  @Max(12, {
    message:
      'Não é permitido que o número de parcelas seja maior que 12! Por favor, digite um número válido de 1 a 12.',
  })
  @ApiProperty({
    example: 5,
  })
  qtdeParcelas: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateCompraDto {
  // @IsUUID()
  // @ApiProperty({
  //   example: '3ca1506a-25a1-4493-ba1f-ad239cc309b8',
  // })
  // produtoId: string;

  // @IsNumber()
  // @ApiProperty({
  //   example: 2299.99,
  // })
  // valorEntrada: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  @ApiProperty({
    example: 5,
  })
  qtdeParcelas: number;
}

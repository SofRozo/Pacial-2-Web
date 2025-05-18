import { IsInt, IsIn } from 'class-validator';

export class CambiarEstadoDTO {
  @IsInt()
  @IsIn([0, 1, 2], { message: 'Estado inválido: debe ser 0, 1 o 2.' })
  estado: 0 | 1 | 2;
}

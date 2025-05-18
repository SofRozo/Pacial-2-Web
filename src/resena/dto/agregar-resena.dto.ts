import { IsString, IsInt, Min, Max, IsDateString } from 'class-validator';

export class AgregarResenaDTO {
  @IsString()
  comentario: string;

  @IsInt()
  @Min(0)
  @Max(5)
  calificacion: number;

  @IsDateString({}, { message: 'La fecha debe estar en formato ISO (YYYY-MM-DD).' })
  fecha: string;
}

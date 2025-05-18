import { IsString, MinLength, Matches, IsDateString, IsInt, Min } from 'class-validator';

export class CrearActividadDTO {
  @IsString()
  @MinLength(15, { message: 'El título debe tener mínimo 15 caracteres.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, {
    message: 'El título no puede contener símbolos.'
  })
  titulo: string;

  @IsDateString({}, { message: 'La fecha debe estar en formato ISO (YYYY-MM-DD).' })
  fecha: string;

  @IsInt()
  @Min(1, { message: 'El cupo máximo debe ser al menos 1.' })
  cupoMaximo: number;
}

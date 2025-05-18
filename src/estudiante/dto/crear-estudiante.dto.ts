import { IsEmail, IsInt, IsString, Min, Max } from 'class-validator';

export class CrearEstudianteDTO {
  @IsInt() @Min(1)
  cedula: number;

  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsInt() 
  @Min(1) 
  @Max(10)
  semestre: number;

  @IsString()
  programa: string;
}

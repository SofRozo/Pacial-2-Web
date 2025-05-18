import {Body, Controller, Post, Get, Param, HttpCode, UsePipes, ValidationPipe,} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CrearEstudianteDTO } from './dto/crear-estudiante.dto';
import { EstudianteDTO } from './dto/estudiante.dto';
import { InscripcionResponseDTO } from './dto/inscripcion-response.dto';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async crear(
    @Body() dto: CrearEstudianteDTO
  ): Promise<EstudianteDTO> {
    const estudiante = await this.estudianteService.crearEstudiante(dto);
    return this.toDTO(estudiante);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string
  ): Promise<EstudianteDTO> {
    const estudiante = await this.estudianteService.findEstudianteById(id);
    return this.toDTO(estudiante);
  }

  @Post(':estudianteId/inscribir/:actividadId')
  @HttpCode(200)
  async inscribir(
    @Param('estudianteId') estudianteId: string,
    @Param('actividadId') actividadId: string
  ): Promise<InscripcionResponseDTO> {
    const mensaje = await this.estudianteService.inscribirseActividad(
      estudianteId,
      actividadId
    );
    return { mensaje };
  }
  /** Mapper Entity → DTO */
  private toDTO(entity: EstudianteEntity): EstudianteDTO {
    const { id, cedula, nombre, correo, semestre, programa } = entity;
    return { id, cedula, nombre, correo, semestre, programa };
  }
}

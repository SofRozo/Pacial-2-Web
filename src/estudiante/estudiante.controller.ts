import { Controller, Post, Param } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post(':estudianteId/inscribir/:actividadId')
  async inscribirseActividad(
    @Param('estudianteId') estudianteId: string,
    @Param('actividadId') actividadId: string,
  ): Promise<string> {
    return this.estudianteService.inscribirseActividad(estudianteId, actividadId);
  }
}
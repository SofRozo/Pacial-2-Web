import {Controller, Post,Get, Param, Body, UsePipes, ValidationPipe, NotFoundException,} from '@nestjs/common';
import { ResenaService } from './resena.service';
import { AgregarResenaDTO } from './dto/agregar-resena.dto';
import { ResenaDTO }       from './dto/resena.dto';
import { ResenaEntity }    from './resena.entity/resena.entity';
import { ParseUUIDPipe } from '@nestjs/common';
@Controller()
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Post('estudiantes/:estudianteId/actividades/:actividadId/resenas')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async agregarResena(
    @Param('estudianteId') estudianteId: string,
    @Param('actividadId') actividadId: string,
    @Body() dto: AgregarResenaDTO
  ): Promise<ResenaDTO> {
    const entidad = await this.resenaService.agregarResena(
      estudianteId,
      actividadId,
      dto
    );
    return this.toDTO(entidad);
  }


  @Get('resenas/:id')
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<ResenaDTO> {
    const entidad = await this.resenaService.findClaseById(id);
    return this.toDTO(entidad);
  }


  /** Mapper Entity → DTO */
  private toDTO(entity: ResenaEntity): ResenaDTO {
    const { id, comentario, calificacion, fecha, estudiante, actividad } = entity;
    return {
      id,
      comentario,
      calificacion,
      fecha,
      estudianteId: estudiante.id,
      actividadId:  actividad.id,
    };
  }
}

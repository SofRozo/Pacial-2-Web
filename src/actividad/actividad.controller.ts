import {Controller, Post, Body, Patch, Param, Query, Get, UsePipes, ValidationPipe, BadRequestException,} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { CrearActividadDTO } from './dto/crear-actividad.dto';
import { CambiarEstadoDTO }  from './dto/cambiar-estado.dto';
import { ActividadDTO }       from './dto/actividad.dto';
import { ActividadEntity }    from './actividad.entity/actividad.entity';

@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async crear(
    @Body() dto: CrearActividadDTO
  ): Promise<ActividadDTO> {
    const actividad = await this.actividadService.crearActividad(dto);
    return this.toDTO(actividad);
  }

  @Patch(':id/estado')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async cambiarEstado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoDTO
  ): Promise<ActividadDTO> {
    const actividad = await this.actividadService.cambiarEstado(id, dto.estado);
    return this.toDTO(actividad);
  }

  @Get()
  async listarPorFecha(
    @Query('fecha') fecha: string    
  ): Promise<ActividadDTO[]> {
    if (!fecha) {
      throw new BadRequestException(
        'El parámetro “fecha” (YYYY-MM-DD) es obligatorio'
      );
    }
    const lista = await this.actividadService.findAllActividadesByDate(fecha);
    return lista.map(a => this.toDTO(a));
  }


  /** Mapper interno de Entity → DTO */
  private toDTO(entity: ActividadEntity): ActividadDTO {
    const { id, titulo, fecha, cupoMaximo, estado } = entity;
    return { id, titulo, fecha, cupoMaximo, estado };
  }
}

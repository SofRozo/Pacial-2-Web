import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadEntity } from './actividad.entity/actividad.entity';

@Injectable()
export class ActividadService {

  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(data: Partial<ActividadEntity>): Promise<ActividadEntity> {
    const tituloRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/;
    if (!data.titulo || data.titulo.length < 15 || !tituloRegex.test(data.titulo)) {
      throw new BadRequestException('El título debe tener mínimo 15 caracteres y no puede tener símbolos.');
    }
    const actividad = this.actividadRepository.create({
      ...data,
      estado: 0,
    });
    return await this.actividadRepository.save(actividad);
  }

  async cambiarEstado(actividadID: string, estado: number): Promise<ActividadEntity> {
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadID },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }
    if (![0, 1, 2].includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }
    if (estado === 1) {
      const porcentaje = actividad.estudiantes.length / actividad.cupoMaximo;
      if (porcentaje < 0.8) {
        throw new BadRequestException('Solo se puede cerrar si el 80% del cupo está lleno');
      }
    }
    if (estado === 2) {
      if (actividad.estudiantes.length < actividad.cupoMaximo) {
        throw new BadRequestException('Solo se puede finalizar si no hay cupo disponible');
      }
    }
    actividad.estado = estado;
    return await this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    return await this.actividadRepository.find({ where: { fecha } });
  }
}
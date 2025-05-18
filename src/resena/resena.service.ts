import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResenaEntity } from './resena.entity/resena.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';


@Injectable()
export class ResenaService {
  constructor(
    @InjectRepository(ResenaEntity)
    private readonly resenaRepository: Repository<ResenaEntity>,
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async agregarResena(
    estudianteID: string,
    actividadID: string,
    data: Partial<ResenaEntity>
  ): Promise<ResenaEntity> {
 
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadID },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }
    if (actividad.estado !== 2) {
      throw new BadRequestException('Solo se pueden agregar reseñas a actividades finalizadas');
    }


    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteID },
      relations: ['actividades'],
    });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    const inscrito = estudiante.actividades.some(a => a.id === actividadID);
    if (!inscrito) {
      throw new BadRequestException('El estudiante no estuvo inscrito en la actividad');
    }

    const resena = this.resenaRepository.create({
      ...data,
      estudiante,
      actividad,
    });
    return await this.resenaRepository.save(resena);}

  async findClaseById(id: string): Promise<ResenaEntity> {
  const resena = await this.resenaRepository.findOne({
        where: { id },
        relations: ['estudiante', 'actividad'],
    });
    if (!resena) {
        throw new NotFoundException('Reseña no encontrada');
    }
    return resena;}

}
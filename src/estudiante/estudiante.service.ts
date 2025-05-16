import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}


  async crearEstudiante(data: Partial<EstudianteEntity>): Promise<EstudianteEntity> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.correo || !emailRegex.test(data.correo)) {
      throw new BadRequestException('El email no es válido');
    }
    if (
      typeof data.semestre !== 'number' ||
      data.semestre < 1 ||
      data.semestre > 10
    ) {
      throw new BadRequestException('El semestre debe estar entre 1 y 10');
    }

    const estudiante = this.estudianteRepository.create(data);
    return await this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: string): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id } });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    return estudiante;
  }
  
  async inscribirseActividad(estudianteID: string, actividadID: string): Promise<string> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteID },
      relations: ['actividades'],
    });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    const actividadRepo = this.estudianteRepository.manager.getRepository(ActividadEntity);
    const actividad = await actividadRepo.findOne({
      where: { id: actividadID },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }
    if (actividad.estado !== 0) {
      throw new BadRequestException('La actividad no está disponible para inscripción');
    }
    if (actividad.estudiantes.length >= actividad.cupoMaximo) {
      throw new BadRequestException('La actividad no tiene cupo disponible');
    }
    const yaInscrito = actividad.estudiantes.some(e => e.id === estudianteID);
    if (yaInscrito) {
      throw new BadRequestException('El estudiante ya está inscrito en esta actividad');
    }
    actividad.estudiantes.push(estudiante);
    await actividadRepo.save(actividad);

    return 'Inscripción exitosa';
  }


}

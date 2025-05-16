import {BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProyectoEntity } from 'src/proyecto/proyecto.entity/proyecto.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  // 1. Crear un profesor (con validación)
  async crearProfesor(data: Partial<ProfesorEntity>): Promise<ProfesorEntity> {
    const { extension } = data;
    if (!extension || extension.toString().length !== 5) {
      throw new BadRequestException('La extensión debe tener exactamente 5 dígitos.');
    }

    const nuevoProfesor = this.profesorRepository.create(data);
    return await this.profesorRepository.save(nuevoProfesor);
  }

  // 2. Obtener todos los profesores
  async obtenerTodos(): Promise<ProfesorEntity[]> {
    return await this.profesorRepository.find({ relations: ['proyectos'] });
  }

  // 3. Obtener un profesor por ID
  async obtenerPorId(id: string): Promise<ProfesorEntity> {
    const profesor = await this.profesorRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con id ${id} no encontrado.`);
    }

    return profesor;
  }

  // 4. Actualizar un profesor
  async actualizarProfesor(id: string, data: Partial<ProfesorEntity>): Promise<ProfesorEntity> {
    const profesor = await this.obtenerPorId(id);

    if (data.extension && data.extension.toString().length !== 5) {
      throw new BadRequestException('La extensión debe tener exactamente 5 dígitos.');
    }

    Object.assign(profesor, data);
    return await this.profesorRepository.save(profesor);
  }

  // 5. Eliminar un profesor
  async eliminarProfesor(id: string): Promise<void> {
    const profesor = await this.obtenerPorId(id);
    await this.profesorRepository.delete(profesor.id);
  }

  // 6. Asignar como par evaluador si tiene menos de 3 evaluaciones activas
  async asignarEvaluador(profesorId: string): Promise<ProfesorEntity> {
    const profesor = await this.obtenerPorId(profesorId);

    const proyectosConEvaluaciones = await this.proyectoRepository.find({
      where: { profesor: { id: profesorId } },
      relations: ['evaluaciones'],
    });

    let totalEvaluaciones = 0;
    for (const proyecto of proyectosConEvaluaciones) {
      totalEvaluaciones += proyecto.evaluaciones?.length || 0;
    }

    if (totalEvaluaciones >= 3) {
      throw new BadRequestException('Este profesor ya tiene 3 o más evaluaciones activas.');
    }

    profesor.es_par_evaluador = true;
    return await this.profesorRepository.save(profesor);
  }
}

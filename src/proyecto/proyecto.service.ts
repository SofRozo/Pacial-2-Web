import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  // 1. Crear proyecto con validaciones
  async crearProyecto(data: Partial<ProyectoEntity>): Promise<ProyectoEntity> {
    const { presupuesto, titulo } = data;

    if (presupuesto === undefined || presupuesto <= 0) {
      throw new BadRequestException('El presupuesto debe ser mayor que 0.');
    }

    if (!titulo || titulo.length <= 15) {
      throw new BadRequestException('El título debe tener más de 15 caracteres.');
    }

    const nuevo = this.proyectoRepository.create(data);
    nuevo.estado = 0; // inicializa estado
    return await this.proyectoRepository.save(nuevo);
  }

  // 2. Avanzar el estado del proyecto
  async avanzarProyecto(id: string): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOneBy({ id });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con id ${id} no encontrado.`);
    }

    if (proyecto.estado >= 4) {
      throw new BadRequestException('El proyecto ya está en el estado máximo (4).');
    }

    proyecto.estado += 1;
    return await this.proyectoRepository.save(proyecto);
  }

  // 3. Listar todos los estudiantes asociados a proyectos
  async findAllEstudiantes(): Promise<EstudianteEntity[]> {
    const proyectos = await this.proyectoRepository.find({
      relations: ['estudiante'],
    });

    // Evita duplicados si hay estudiantes con múltiples proyectos
    const estudiantesMap = new Map<string, EstudianteEntity>();
    for (const proyecto of proyectos) {
      if (proyecto.estudiante) {
        estudiantesMap.set(proyecto.estudiante.id, proyecto.estudiante);
      }
    }

    return Array.from(estudiantesMap.values());
  }

  async findEstudianteByProyecto(id: string): Promise<EstudianteEntity> {
  const proyecto = await this.proyectoRepository.findOne({
    where: { id },
    relations: ['estudiante'],
  });

  if (!proyecto || !proyecto.estudiante) {
    throw new NotFoundException('Proyecto o estudiante no encontrado.');
  }

  return proyecto.estudiante;
    }


  
}

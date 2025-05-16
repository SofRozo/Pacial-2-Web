import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

    // Crear 

    async crearEstudiante(data: Partial<EstudianteEntity>): Promise<EstudianteEntity> {
    const { promedio, semestre } = data;

    if (promedio === undefined || semestre === undefined) {
        throw new BadRequestException('Se requieren los campos "promedio" y "semestre".');
    }

    if (promedio <= 3.2 || semestre < 4) {
        throw new BadRequestException(
        'El estudiante debe tener un promedio > 3.2 y estar en semestre ≥ 4',
        );
    }

    const nuevoEstudiante = this.estudianteRepository.create(data);
    return await this.estudianteRepository.save(nuevoEstudiante);
    }


    // Eliminar un estudiante solo si no tiene proyectos activos
    async eliminarEstudiante(id: string): Promise<void> {
        const estudiante = await this.estudianteRepository.findOne({
        where: { id },
        relations: ['proyectos'],
        });

        if (!estudiante) {
        throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
        }

        const tieneProyectosActivos = estudiante.proyectos?.length > 0;
        if (tieneProyectosActivos) {
        throw new BadRequestException('No se puede eliminar un estudiante con proyectos activos');
        }

        await this.estudianteRepository.delete(id);
    }
}

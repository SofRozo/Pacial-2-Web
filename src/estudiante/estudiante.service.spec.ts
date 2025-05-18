import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estRepo: MockRepo<EstudianteEntity>;
  let actRepo: MockRepo<ActividadEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: getRepositoryToken(EstudianteEntity),
          useValue: createMockRepo<EstudianteEntity>(),
        },
        {
          provide: getRepositoryToken(ActividadEntity),
          useValue: createMockRepo<ActividadEntity>(), 
        },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estRepo = module.get<MockRepo<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    actRepo = module.get<MockRepo<ActividadEntity>>(getRepositoryToken(ActividadEntity));


    (estRepo as any).manager = {
      getRepository: () => actRepo,
    };
  });

  describe('crearEstudiante', () => {
    it('crea estudiante válido', async () => {
      const dto = {
        correo: 'test@example.com',
        semestre: 5,
        cedula: 123,
        nombre: 'Juan Pérez',
        programa: 'Ingeniería',
      };
      const entidad = Object.assign(new EstudianteEntity(), { id: 'e1', ...dto });
      estRepo.create!.mockReturnValue(entidad);
      estRepo.save!.mockResolvedValue(entidad);

      const res = await service.crearEstudiante(dto);
      expect(estRepo.create).toHaveBeenCalledWith(dto);
      expect(estRepo.save).toHaveBeenCalledWith(entidad);
      expect(res).toEqual(entidad);
    });

    it('lanza BadRequestException si email inválido', async () => {
      await expect(
        service.crearEstudiante({ correo: 'bademail', semestre: 3 })
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lanza BadRequestException si semestre fuera de rango', async () => {
      await expect(
        service.crearEstudiante({ correo: 'ok@test.com', semestre: 0 })
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        service.crearEstudiante({ correo: 'ok@test.com', semestre: 11 })
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('findEstudianteById', () => {
    it('devuelve entidad si existe', async () => {
      const entidad = Object.assign(new EstudianteEntity(), { id: 'e2' });
      estRepo.findOne!.mockResolvedValue(entidad);

      const res = await service.findEstudianteById('e2');
      expect(estRepo.findOne).toHaveBeenCalledWith({ where: { id: 'e2' } });
      expect(res).toEqual(entidad);
    });

    it('lanza NotFoundException si no existe', async () => {
      estRepo.findOne!.mockResolvedValue(undefined);
      await expect(service.findEstudianteById('no-id')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('inscribirseActividad', () => {
    const estudiante = Object.assign(new EstudianteEntity(), { id: 'e3', actividades: [] });
    const actividadBase = {
      id: 'a1',
      estado: 0,
      cupoMaximo: 2,
      estudiantes: [],
    } as any as ActividadEntity;

    it('inscribe correctamente si todo válido', async () => {
      estRepo.findOne!.mockResolvedValue(estudiante);
      actRepo.findOne!.mockResolvedValue({ ...actividadBase, estudiantes: [] });
      actRepo.save!.mockResolvedValue(null);

      const res = await service.inscribirseActividad('e3', 'a1');
      expect(estRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'e3' },
        relations: ['actividades'],
      });
      expect(actRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'a1' },
        relations: ['estudiantes'],
      });
      expect(res).toBe('Inscripción exitosa');
    });

    it('NotFoundException si estudiante no existe', async () => {
      estRepo.findOne!.mockResolvedValue(undefined);
      await expect(service.inscribirseActividad('no-e', 'a1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('NotFoundException si actividad no existe', async () => {
      estRepo.findOne!.mockResolvedValue(estudiante);
      actRepo.findOne!.mockResolvedValue(undefined);
      await expect(service.inscribirseActividad('e3', 'no-a')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('BadRequestException si actividad no abierta', async () => {
      estRepo.findOne!.mockResolvedValue(estudiante);
      actRepo.findOne!.mockResolvedValue({ ...actividadBase, estado: 1, estudiantes: [] });
      await expect(service.inscribirseActividad('e3', 'a1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('BadRequestException si cupo lleno', async () => {
      estRepo.findOne!.mockResolvedValue(estudiante);
      actRepo.findOne!.mockResolvedValue({ ...actividadBase, estudiantes: [{}, {}] });
      await expect(service.inscribirseActividad('e3', 'a1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('BadRequestException si ya inscrito', async () => {
      const actividad = Object.assign(new ActividadEntity(), {
        ...actividadBase,
        estudiantes: [{ id: 'e3' }],
      });
      estRepo.findOne!.mockResolvedValue(estudiante);
      actRepo.findOne!.mockResolvedValue(actividad);
      await expect(service.inscribirseActividad('e3', 'a1')).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});

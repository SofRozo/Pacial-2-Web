import { Test, TestingModule } from '@nestjs/testing';
import { ResenaService } from './resena.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResenaEntity }     from './resena.entity/resena.entity';
import { ActividadEntity }  from '../actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('ResenaService', () => {
  let service: ResenaService;
  let rRepo: MockRepo<ResenaEntity>;
  let aRepo: MockRepo<ActividadEntity>;
  let eRepo: MockRepo<EstudianteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResenaService,
        {
          provide: getRepositoryToken(ResenaEntity),
          useValue: createMockRepo<ResenaEntity>(),
        },
        {
          provide: getRepositoryToken(ActividadEntity),
          useValue: createMockRepo<ActividadEntity>(),
        },
        {
          provide: getRepositoryToken(EstudianteEntity),
          useValue: createMockRepo<EstudianteEntity>(),
        },
      ],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    rRepo = module.get<MockRepo<ResenaEntity>>(getRepositoryToken(ResenaEntity));
    aRepo = module.get<MockRepo<ActividadEntity>>(getRepositoryToken(ActividadEntity));
    eRepo = module.get<MockRepo<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
  });

  describe('agregarResena', () => {
    const dto = {
      comentario: 'Excelente actividad',
      calificacion: 5,
      fecha: '2025-05-18',
    };

    it('crea y retorna la reseña cuando todo es válido', async () => {
      const actividad = Object.assign(new ActividadEntity(), {
        id: 'a1',
        estado: 2,
        estudiantes: [{ id: 'e1' }],
      });
      const estudiante = Object.assign(new EstudianteEntity(), {
        id: 'e1',
        actividades: [{ id: 'a1' }],
      });
      const resenaEntity = Object.assign(new ResenaEntity(), {
        id: 'r1',
        ...dto,
        estudiante,
        actividad,
      });

      aRepo.findOne!.mockResolvedValue(actividad);
      eRepo.findOne!.mockResolvedValue(estudiante);
      rRepo.create!.mockReturnValue(resenaEntity);
      rRepo.save!.mockResolvedValue(resenaEntity);

      const result = await service.agregarResena('e1', 'a1', dto);

      expect(aRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'a1' },
        relations: ['estudiantes'],
      });
      expect(eRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'e1' },
        relations: ['actividades'],
      });
      expect(rRepo.create).toHaveBeenCalledWith({
        ...dto,
        estudiante,
        actividad,
      });
      expect(result).toEqual(resenaEntity);
    });

    it('lanza NotFoundException si la actividad no existe', async () => {
      aRepo.findOne!.mockResolvedValue(undefined);
      await expect(
        service.agregarResena('e1', 'no-existe', dto)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lanza BadRequestException si la actividad no está finalizada', async () => {
      aRepo.findOne!.mockResolvedValue(Object.assign(new ActividadEntity(), {
        id: 'a1',
        estado: 1,
        estudiantes: [{ id: 'e1' }],
      }));
      await expect(
        service.agregarResena('e1', 'a1', dto)
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lanza NotFoundException si el estudiante no existe', async () => {
      aRepo.findOne!.mockResolvedValue(Object.assign(new ActividadEntity(), {
        id: 'a1',
        estado: 2,
        estudiantes: [{ id: 'e1' }],
      }));
      eRepo.findOne!.mockResolvedValue(undefined);
      await expect(
        service.agregarResena('no-e', 'a1', dto)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lanza BadRequestException si el estudiante no estaba inscrito', async () => {
      aRepo.findOne!.mockResolvedValue(Object.assign(new ActividadEntity(), {
        id: 'a1',
        estado: 2,
        estudiantes: [{ id: 'otro' }],
      }));
      eRepo.findOne!.mockResolvedValue(Object.assign(new EstudianteEntity(), {
        id: 'e1',
        actividades: [{ id: 'otro' }],
      }));
      await expect(
        service.agregarResena('e1', 'a1', dto)
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('findClaseById', () => {
    it('devuelve la reseña si existe', async () => {
      const resena = Object.assign(new ResenaEntity(), { id: 'r1' });
      rRepo.findOne!.mockResolvedValue(resena);
      const result = await service.findClaseById('r1');
      expect(rRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'r1' },
        relations: ['estudiante', 'actividad'],
      });
      expect(result).toBe(resena);
    });

    it('lanza NotFoundException si no existe', async () => {
      rRepo.findOne!.mockResolvedValue(undefined);
      await expect(service.findClaseById('no-r')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

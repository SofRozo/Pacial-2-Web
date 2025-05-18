import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('ActividadService', () => {
  let service: ActividadService;
  let repo: MockRepo<ActividadEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        {
          provide: getRepositoryToken(ActividadEntity),
          useValue: createMockRepo<ActividadEntity>(),
        },
      ],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repo = module.get<MockRepo<ActividadEntity>>(getRepositoryToken(ActividadEntity));
  });

  describe('crearActividad', () => {
    it('crea actividad válida', async () => {
      const dto = { titulo: 'Título válido de prueba', fecha: '2025-05-18', cupoMaximo: 10 };
      const entidad = Object.assign(new ActividadEntity(), { id: '1', ...dto, estado: 0 });
      repo.create!.mockReturnValue(entidad);
      repo.save!.mockResolvedValue(entidad);

      const res = await service.crearActividad(dto);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, estado: 0 });
      expect(res).toEqual(entidad);
    });

    it('lanza BadRequestException si título invalido', async () => {
      await expect(
        service.crearActividad({ titulo: 'corto', fecha: '2025-05-18', cupoMaximo: 5 })
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('cambiarEstado', () => {
    const base = {
      id: 'a1',
      titulo: 'Actividad válida de largo suficiente',
      fecha: '2025-05-18',
      cupoMaximo: 5,
      estado: 0,
      estudiantes: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }, { id: 'e4' }],
    } as any as ActividadEntity;

    it('cierra actividad con ≥80% de cupo', async () => {
      repo.findOne!.mockResolvedValue(base);
      repo.save!.mockResolvedValue({ ...base, estado: 1 });

      const res = await service.cambiarEstado('a1', 1);
      expect(res.estado).toBe(1);
    });

    it('NotFoundException si no existe', async () => {
      repo.findOne!.mockResolvedValue(undefined);
      await expect(service.cambiarEstado('nope', 1)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('BadRequestException para estado no permitido', async () => {
      repo.findOne!.mockResolvedValue(base);
      await expect(service.cambiarEstado('a1', 9)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('BadRequestException si <80% al cerrar', async () => {
      repo.findOne!.mockResolvedValue({ ...base, estudiantes: [{ id: 'x' }] });
      await expect(service.cambiarEstado('a1', 1)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('findAllActividadesByDate', () => {
    it('delega al repositorio', async () => {
      const lista = [Object.assign(new ActividadEntity(), { id: '1', fecha: '2025-05-18' })];
      repo.find!.mockResolvedValue(lista);
      const res = await service.findAllActividadesByDate('2025-05-18');
      expect(repo.find).toHaveBeenCalledWith({ where: { fecha: '2025-05-18' } });
      expect(res).toBe(lista);
    });
  });
});

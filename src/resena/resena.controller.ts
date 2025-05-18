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

  // Aquí tus tests de agregarResena y findClaseById...
});

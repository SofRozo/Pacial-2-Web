import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity/resena.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResenaEntity,  ActividadEntity, EstudianteEntity])],
  providers: [ResenaService]
})
export class ResenaModule {}

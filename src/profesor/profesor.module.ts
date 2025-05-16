import { Module } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProyectoEntity } from 'src/proyecto/proyecto.entity/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfesorEntity, ProyectoEntity])],
  providers: [ProfesorService]
})
export class ProfesorModule {}

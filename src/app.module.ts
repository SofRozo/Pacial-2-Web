import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { EstudianteEntity } from './estudiante/estudiante.entity/estudiante.entity';
import { ActividadModule } from './actividad/actividad.module';
import { ResenaModule } from './resena/resena.module';
import { ResenaEntity } from './resena/resena.entity/resena.entity';
import { ActividadEntity } from './actividad/actividad.entity/actividad.entity';

@Module({
  imports: [EstudianteModule, ActividadModule, ResenaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'proyecto',
      entities: [EstudianteEntity, ActividadEntity, ResenaEntity],
      dropSchema: true,
      synchronize: true
    }),
    ActividadModule,
    ResenaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



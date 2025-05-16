import { ProyectoEntity } from 'src/proyecto/proyecto.entity/proyecto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  cedula: number;
  @Column()
  nombre: string;
  @Column()
  semestre: number;
  @Column()
  programa: string;
  @Column()
  promedio: number;
  // Asociaciones
  //Tiene una de uno a muchos con proyecto (). El estudiante maneja los proyectos. 
   @OneToMany(() => ProyectoEntity, proyecto => proyecto.estudiante)
   proyectos: ProyectoEntity[];

}

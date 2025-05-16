import { ResenaEntity } from 'src/resena/resena.entity/resena.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';
@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  cedula: number; //
  @Column()
  nombre: string; //
  @Column()
  correo: string; //
  @Column()
  semestre: number;//
  @Column()
  programa: string;//

  //Asociaciones
   @OneToMany(() => ResenaEntity, resena => resena.estudiante)
   resenas: ResenaEntity[];

   @ManyToMany(() => ActividadEntity, actividad => actividad.estudiantes)
   @JoinTable()
   actividades: ActividadEntity[];

}

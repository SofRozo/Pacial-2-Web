import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';
import { ResenaEntity } from 'src/resena/resena.entity/resena.entity';
@Entity()
export class ActividadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string; //
    @Column()
    titulo: string; //
    @Column()
    fecha: string; //
    @Column()
    cupoMaximo: number; //
    @Column()
    estado: number;//

    @ManyToMany(() => EstudianteEntity, estudiante => estudiante.actividades)
    estudiantes: EstudianteEntity[];
    @OneToMany(() => ResenaEntity, resena => resena.actividad)
    resenas: ResenaEntity[];
}

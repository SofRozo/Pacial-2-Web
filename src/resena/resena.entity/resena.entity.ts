import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../../actividad/actividad.entity/actividad.entity';
@Entity()
export class ResenaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string; //
    @Column()
    comentario: string;
    @Column()
    calificacion: number;
    @Column()
    fecha: string;

    // Asociaciones Estudiante y actiidad
    @ManyToOne(() => EstudianteEntity, estudiante => estudiante.resenas)
    estudiante: EstudianteEntity;
    @ManyToOne(() => ActividadEntity, actividad => actividad.resenas)
    actividad: ActividadEntity;

}

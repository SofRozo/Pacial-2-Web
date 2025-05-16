import { EstudianteEntity } from "src/estudiante/estudiante.entity/estudiante.entity";
import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfesorEntity } from "src/profesor/profesor.entity/profesor.entity";
import { EvaluacionEntity } from "src/evaluacion/evaluacion.entity/evaluacion.entity";
@Entity()
export class ProyectoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    titulo: string;
    @Column()
    area: string;
    @Column()
    presupuesto: number;
    @Column()
    nota_final: number;
    @Column()
    fecha_inicio: Date;
    @Column()
    fecha_fin: Date;
    @Column()
    estado: number;

    // Asociaciones
    @ManyToOne(() => EstudianteEntity, estudiante => estudiante.proyectos)
    estudiante: EstudianteEntity;

    @ManyToOne(() => ProfesorEntity, profesor => profesor.proyectos)
    profesor: ProfesorEntity;

    @OneToMany(() => EvaluacionEntity, evaluacion => evaluacion.proyecto)
    evaluaciones: EvaluacionEntity[];

}

import { ProyectoEntity } from 'src/proyecto/proyecto.entity/proyecto.entity';
import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProfesorEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    cedula: number;
    @Column()
    nombre: string;
    @Column()
    departamento: string;
    @Column()
    extension: number;
    @Column()
    es_par_evaluador: boolean;

    // Asociaciones
    @OneToMany(() => ProyectoEntity, proyecto => proyecto.profesor)
    proyectos: ProyectoEntity[];
}

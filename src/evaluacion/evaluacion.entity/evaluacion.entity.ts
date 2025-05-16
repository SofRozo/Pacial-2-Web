import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProyectoEntity } from "src/proyecto/proyecto.entity/proyecto.entity";
@Entity()
export class EvaluacionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProyectoEntity, proyecto => proyecto.evaluaciones)
    proyecto: ProyectoEntity;
}

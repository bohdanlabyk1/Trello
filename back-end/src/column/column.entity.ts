// column.entity.ts
import { Entity, PrimaryGeneratedColumn, Column as Column, ManyToOne, OneToMany } from "typeorm";
import { Project } from "../progect/project.entiti";
import { Task } from "./../task/task.entity";

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
 @Column({ default: '#3b82f6' })
  color: string;
  @Column({ default: 0 })
  order: number; 

  @ManyToOne(() => Project, (project) => project.columns, { onDelete: 'CASCADE' })
  project: Project;

  @OneToMany(() => Task, (task) => task.column, { cascade: true })
  tasks: Task[];
}

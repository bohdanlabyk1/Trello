// sprint.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './../progect/project.entiti';
import { Task } from 'src/task/task.entity';

@Entity('sprints')
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ default: false })
isActive: boolean;

@Column({ default: false })
isClosed: boolean;


  @ManyToOne(() => Project, (project) => project.sprints, { onDelete: 'CASCADE' })
  project: Project;

  @OneToMany(() => Task, (task) => task.sprint)
  tasks: Task[];
}

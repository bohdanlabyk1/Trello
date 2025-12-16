// task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { ColumnEntity } from "./../column/column.entity";
import { Sprint } from "src/sprint/sprint.entity";
import { Comment } from "./../coments/coment.entity";

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;
  
  @Column({ default: 'todo' }) 
status: string;

@Column({ default: 'low' })
priority: string;

@Column({ nullable: true })
label: string;

 @ManyToOne(() => ColumnEntity, column => column.tasks, { onDelete: 'CASCADE' })
column: ColumnEntity;

  @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
  comments: Comment[];

  @ManyToOne(() => Sprint, (sprint) => sprint.tasks, { nullable: true, onDelete: 'SET NULL' })
sprint: Sprint | null;

}

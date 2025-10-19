import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Auth } from 'src/auth-user/auth-user.entiti';
import { ColumnEntity } from 'src/column/column.entity';
import { Invitation } from 'src/invitation/invitation.entiti';
import { Sprint} from './../sprint/sprint.entity'

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // Власник проєкту
  @ManyToOne(() => Auth, (user) => user.ownedProjects, { onDelete: 'CASCADE' })
  owner: Auth;

  // Колонки (дошки)
  @OneToMany(() => ColumnEntity, (col) => col.project, { cascade: true })
  columns: ColumnEntity[];

  // Учасники (множинний зв’язок)
  @ManyToMany(() => Auth, (user) => user.projects, { cascade: true })
  @JoinTable({
    name: 'project_members', // назва проміжної таблиці
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: Auth[];

  // src/progect/project.entiti.ts
@OneToMany(() => Invitation, (inv) => inv.project)
invitations: Invitation[];

@OneToMany(() => Sprint, (sprint) => sprint.project)
sprints: Sprint[];

}

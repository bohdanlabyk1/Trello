import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Auth } from "src/auth-user/auth-user.entiti";
import { ColumnEntity } from "src/column/column.entity";

@Entity('project')
export class Project {
    @PrimaryGeneratedColumn()
  id: number;
 @Column()
  name: string;

  @Column()
  description: string;
  
 @ManyToOne(() => Auth, (user) => user.projects, { onDelete: 'CASCADE' })
  user: Auth;
   @OneToMany(() => ColumnEntity, (col) => col.project, { cascade: true })
  columns: ColumnEntity[];
}
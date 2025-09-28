import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Auth } from "src/auth-user/auth-user.entiti";

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
}
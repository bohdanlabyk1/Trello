import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Project } from "src/progect/project.entiti";

@Entity('auths')
export class Auth {
    @PrimaryGeneratedColumn()
  id: number;
 @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

@OneToMany(() => Project, (project) => project.user)
projects: Project[];

}
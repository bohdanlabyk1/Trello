import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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


}
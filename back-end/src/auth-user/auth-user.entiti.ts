import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Project } from "./../progect/project.entiti";
import { Invitation } from "src/invitation/invitation.entiti";

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

  // 🔹 Проекти, створені користувачем (він власник)
  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  // 🔹 Проекти, в яких користувач є учасником
  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];

  @OneToMany(() => Invitation, (inv) => inv.sender)
sentInvitations: Invitation[];

@OneToMany(() => Invitation, (inv) => inv.recipient)
receivedInvitations: Invitation[];
}

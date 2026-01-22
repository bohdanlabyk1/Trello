import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Project } from "./../progect/project.entiti";
import { Notification } from './../invitation/noification.entiti';
import { Invitation } from "src/invitation/invitation.entiti";
import {ActivityLog} from './../actyviti/actyviti.entiti'

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

  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];

  @OneToMany(() => Invitation, (inv) => inv.sender)
sentInvitations: Invitation[];

@OneToMany(() => Notification, (n) => n.user)
notifications: Notification[];

@OneToMany(() => Invitation, (inv) => inv.recipient)
receivedInvitations: Invitation[];

@OneToMany(() => ActivityLog, (activity: ActivityLog) => activity.user)
activityLogs: ActivityLog[];

}

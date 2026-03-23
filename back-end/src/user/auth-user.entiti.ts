import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Project } from "../project/project.entiti";
import { Notification } from '../invitation/noification.entiti';
import { Invitation } from "src/invitation/invitation.entiti";
import {ActivityLog} from '../activity/activity.entiti'

@Entity('auths')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

   @Column({ length:40 })
  first_name: string;

  @Column({ length: 40 })
  last_name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 150 })
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

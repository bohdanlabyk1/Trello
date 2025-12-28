import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @Column()
  userId: number;

  @Column()
  action: string;
  /*
    CREATE_TASK
    CHANGE_STATUS
    MOVE_TASK
    MOVE_COLUMN
    ADD_MEMBER
  */

  @Column({ nullable: true })
  entityType: string; // task | column | project | user

  @Column({ nullable: true })
  entityId: number;

  @Column({ type: 'json', nullable: true })
  meta: any;

  @CreateDateColumn()
  createdAt: Date;
}

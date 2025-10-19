// src/invitation/invitation.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entiti';
import { Auth } from 'src/auth-user/auth-user.entiti';
import { Project } from 'src/progect/project.entiti';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation) private repo: Repository<Invitation>,
    @InjectRepository(Auth) private users: Repository<Auth>,
    @InjectRepository(Project) private projects: Repository<Project>,
  ) {}

  async inviteUser(senderId: number, recipientEmail: string, projectId: number) {
    const sender = await this.users.findOneBy({ id: senderId });
    const recipient = await this.users.findOneBy({ email: recipientEmail });
    const project = await this.projects.findOneBy({ id: projectId });

    if (!recipient) throw new NotFoundException('Користувач не знайдений');
    if (!project) throw new NotFoundException('Проєкт не знайдений');

    const existing = await this.repo.findOne({
      where: { recipient, project, status: 'pending' },
    });
    if (existing) throw new BadRequestException('Запрошення вже відправлено');

    const invitation = this.repo.create({ sender, recipient, project });
    return this.repo.save(invitation);
  }

  async getUserInvitations(userId: number) {
    return this.repo.find({
      where: { recipient: { id: userId } },
      relations: ['sender', 'project'],
      order: { createdAt: 'DESC' },
    });
  }

  async respondToInvitation(inviteId: number, userId: number, accept: boolean) {
    const invite = await this.repo.findOne({
      where: { id: inviteId },
      relations: ['recipient', 'project'],
    });
    if (!invite) throw new NotFoundException('Запрошення не знайдене');
    if (invite.recipient.id !== userId) throw new BadRequestException('Це не ваше запрошення');

    if (accept) {
      invite.status = 'accepted';
      const project = await this.projects.findOne({
        where: { id: invite.project.id },
        relations: ['members'],
      });
      project.members.push(invite.recipient);
      await this.projects.save(project);
    } else {
      invite.status = 'rejected';
    }

    return this.repo.save(invite);
  }
}

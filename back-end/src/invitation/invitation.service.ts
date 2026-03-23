import { Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entiti';
import { Notification } from './noification.entiti';
import { Auth } from 'src/user/auth-user.entiti';
import { Project } from 'src/project/project.entiti';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private repo: Repository<Invitation>,

    @InjectRepository(Auth)
    private users: Repository<Auth>,

    @InjectRepository(Project)
    private projects: Repository<Project>,

    @InjectRepository(Notification)
    private notificationsRepo: Repository<Notification>,
  ) {}
async markAsRead(
  inviteId: number,
  userId: number,
) {
  const invite = await this.repo.findOne({
    where: { id: inviteId },
    relations: ['recipient', 'sender'],
  });

  if (!invite)
    throw new NotFoundException(
      'Запрошення не знайдене',
    );

  const isRecipient =
    invite.recipient.id === userId;

  const isSender =
    invite.sender.id === userId;

  if (!isRecipient && !isSender)
    throw new BadRequestException(
      'Це не ваше запрошення',
    );

  invite.isRead = true;

  await this.repo.save(invite);

  return {
    message: 'Позначено як прочитане',
  };
}

 
  async inviteUser(
    senderId: number,
    recipientEmail: string,
    projectId: number,
  ) {
  
    const sender = await this.users.findOneBy({
      id: senderId,
    });

    const recipient = await this.users.findOneBy({
      email: recipientEmail,
    });

    const project = await this.projects.findOne({
      where: { id: projectId },
      relations: ['members'],
    });

  
    if (!sender)
      throw new NotFoundException(
        'Відправник не знайдений',
      );

    if (!recipient)
      throw new NotFoundException(
        'Користувач не знайдений',
      );

    if (!project)
      throw new NotFoundException(
        'Проєкт не знайдений',
      );

    
    if (sender.id === recipient.id) {
      throw new BadRequestException(
        'Не можна запросити себе',
      );
    }

    const alreadyMember =
      project.members.some(
        (u) => u.id === recipient.id,
      );

    if (alreadyMember) {
      throw new BadRequestException(
        'Користувач вже в проєкті',
      );
    }

    const existing = await this.repo.findOne({
      where: {
        recipient: { id: recipient.id },
        project: { id: project.id },
        status: 'pending',
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Запрошення вже відправлено',
      );
    }

    const invitation = this.repo.create({
      sender,
      recipient,
      project,
      status: 'pending',
    });

    const saved = await this.repo.save(
      invitation,
    );

    await this.notificationsRepo.save(
      this.notificationsRepo.create({
        user: recipient,
        message: `${sender.first_name} запросив вас до проєкту "${project.name}"`,
      }),
    );

    return saved;
  }

  async getSentInvitations(
    userId: number,
  ) {
    return this.repo.find({
      where: {
        sender: { id: userId },
         isRead: false,
      },
      relations: [
        'recipient',
        'project',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getUserInvitations(
    userId: number,
  ) {
    return this.repo.find({
      where: {
        recipient: { id: userId },
        status: 'pending',
        isRead: false
      },
      relations: [
        'sender',
        'project',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async respondToInvitation(
    inviteId: number,
    userId: number,
    accept: boolean,
  ) {
    const invite =
      await this.repo.findOne({
        where: { id: inviteId },
        relations: [
          'recipient',
          'sender',
          'project',
        ],
      });

    if (!invite)
      throw new NotFoundException(
        'Запрошення не знайдене',
      );

    if (invite.recipient.id !== userId)
      throw new BadRequestException(
        'Це не ваше запрошення',
      );

    if (accept) {
      invite.status = 'accepted';
      invite.isRead = true;

      const project =
        await this.projects.findOne({
          where: {
            id: invite.project.id,
          },
          relations: [
            'members',
          ],
        });

      if (!project)
        throw new NotFoundException(
          'Проєкт не знайдений',
        );

      const alreadyMember =
        project.members.some(
          (u) =>
            u.id ===
            invite.recipient.id,
        );

      if (!alreadyMember) {
        project.members.push(
          invite.recipient,
        );
        await this.projects.save(
          project,
        );
      }

      await this.notificationsRepo.save(
        this.notificationsRepo.create(
          {
            user: invite.sender,
            message: `${invite.recipient.first_name} прийняв запрошення до проєкту "${project.name}"`,
          },
        ),
      );
    }

    else {
      invite.status = 'rejected';
      invite.isRead = true;

      await this.notificationsRepo.save(
        this.notificationsRepo.create(
          {
            user: invite.sender,
            message: `${invite.recipient.first_name} відхилив запрошення до проєкту "${invite.project.name}"`,
          },
        ),
      );
    }

    await this.repo.save(invite);

    return invite;
  }

  async getPendingCount(
    userId: number,
  ) {
    const count =
      await this.repo.count({
        where: {
          recipient: {
            id: userId,
          },
          status: 'pending',
          isRead: false
        },
      });

    return { count };
  }
}

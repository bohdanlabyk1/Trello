import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entiti';
import { ProjectService } from './progect.service';
import { ProjectController } from './progect.controller';
import { JwtModule } from '@nestjs/jwt';
import { ColumnEntity } from '../column/column.entity';
import { Auth } from 'src/auth-user/auth-user.entiti';


@Module({
   imports: [TypeOrmModule.forFeature([Project, Auth, ColumnEntity]),
   JwtModule.register({
      secret: 'SUPER_SECRET_JWT_KEY',   // той самий, що в AuthUserModule
      signOptions: { expiresIn: '1d' },
    }),

  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProgectModule {}

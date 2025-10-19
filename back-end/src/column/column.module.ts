import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ColumnController } from './column.controller';
import { ColumnEntity } from './column.entity';
import { Project } from 'src/progect/project.entiti';
import { AuthUserModule } from 'src/auth-user/auth-user.module';

@Module({
   imports: [TypeOrmModule.forFeature([ColumnEntity, Project]),
  AuthUserModule],
  controllers: [ColumnController],
  providers: [ColumnService],
})
export class ColumnModule {}

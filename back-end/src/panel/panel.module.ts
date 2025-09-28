import { Module } from '@nestjs/common';
import { PanelService } from './panel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelController } from './panel.controller';
import { Panel } from './panel.entity';
import { Item } from './item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Panel, Item])],
  controllers: [PanelController],
  providers: [PanelService],
})
export class PanelModule {}

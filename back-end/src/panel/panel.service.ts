import { Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from './panel.entity';

@Injectable()
export class PanelService {
     constructor(
            @InjectRepository(Panel)
    private panelRepositori: Repository<Panel>
     ) {}
    async getPanel(): Promise<Panel[]>{
      return await this.panelRepositori.find({ relations: ['items'] });

    }
}

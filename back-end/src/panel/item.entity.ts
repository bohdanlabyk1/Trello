import { Column, Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { Panel } from "./panel.entity";

@Entity('item')
 export class Item{
    @PrimaryColumn()
    id: number;

    @Column()
    name: string
     @ManyToOne(() => Panel, (panel) => panel.items, { onDelete: 'CASCADE' })
  panel: Panel;
}
 
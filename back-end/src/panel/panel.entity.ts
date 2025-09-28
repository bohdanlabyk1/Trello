import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Item } from "./item.entity";
@Entity('panel')
export class Panel {
    @PrimaryGeneratedColumn() 
    id:number;

    @Column()
     title: string;

  @OneToMany(() => Item, (item) => item.panel, { cascade: true })
  items: Item[];
}
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column()
  token: string;

  @Column()
  filePath: string;

  @Column({ nullable: true })
  thumbnailPath?: string;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  duration?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: null })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.records)
  user: User;
}

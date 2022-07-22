import { Column, Model, Table, Unique } from 'sequelize-typescript';

@Table({ tableName: 'user' })
export class User extends Model {
  @Unique
  @Column({
    allowNull: false,
  })
  email: string;

  @Column({
    allowNull: false,
  })
  passwordHash: string;

  @Column({
    allowNull: false,
  })
  role: string;
}

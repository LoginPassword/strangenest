import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'refresh-token' })
export class RefreshToken extends Model {
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({
    allowNull: false,
  })
  refreshToken: string;
}

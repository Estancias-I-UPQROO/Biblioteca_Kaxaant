import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Admin',
  timestamps: true
})
export class Admin extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare ID_Admin: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare Usuario: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare Password: string;
}

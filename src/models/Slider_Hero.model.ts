import { Table, Model, Default, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Slider_Hero',
  timestamps: true
})
export class Slider_Hero extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare ID_Slider_Hero: string;

  @Column({
    type: DataType.STRING(512),
    allowNull: false,
  })
  declare Imagen_URL: string;
}

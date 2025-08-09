import { Table, Model, Column, DataType, Default } from 'sequelize-typescript';

@Table({ tableName: 'SubEventos', timestamps: true })
export class SubEventos extends Model {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true, unique: true })
  declare ID_SubEvento: string;

  @Column({ type: DataType.UUID, allowNull: false })
  declare ID_Evento: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare Titulo: string;

  @Column({ type: DataType.STRING(512), allowNull: false })
  declare Imagen_URL: string;
}

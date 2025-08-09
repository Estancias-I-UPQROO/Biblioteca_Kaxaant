import { Table, Model, Column, DataType, Default, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'Eventos', timestamps: true })
export class Eventos extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare ID_Evento: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare Titulo: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare Descripcion: string;

  @Column({ type: DataType.STRING(512), allowNull: false })
  declare Imagen_URL: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  declare Activo: boolean;
}

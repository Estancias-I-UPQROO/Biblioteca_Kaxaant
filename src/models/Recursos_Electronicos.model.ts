import { Table, Model, Default, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Recursos_Electronicos',
  timestamps: true
})
export class Recursos_Electronicos extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare ID_Recurso_Electronico: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare Nombre: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare Descripcion: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare Imagen_URL: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare Enlace_Pagina: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare Activo: boolean;
}

import { Table, Model, Default, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Categorias_Recursos_Electronicos',
  timestamps: true
})
export class Categorias_Recursos_Electronicos extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare ID_Categoria_Recursos_Electronicos: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare Nombre: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare Activo: boolean;
}

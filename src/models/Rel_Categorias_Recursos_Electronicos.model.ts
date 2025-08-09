import { Table, Model, Default, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Rel_Categorias_Recursos_Electronicos',
  timestamps: true
})
export class Rel_Categorias_Recursos_Electronicos extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare ID_Rel_Categorias_Recursos_Electronicos: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare ID_Recurso_Electronico: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare ID_Categoria_Recursos_Electronicos: string;
}

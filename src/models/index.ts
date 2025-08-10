// src/models/relations.ts
import { Categorias_Recursos_Electronicos } from './Categorias_Recursos_Electronicos.model';
import { Recursos_Electronicos } from './Recursos_Electronicos.model';
import { Rel_Categorias_Recursos_Electronicos } from './Rel_Categorias_Recursos_Electronicos.model';

let relationsInitialized = false;

export function setupRelations() {
  if (relationsInitialized) return;
  
  // Relación Categorias -> Relaciones (usa alias único)
  Categorias_Recursos_Electronicos.hasMany(Rel_Categorias_Recursos_Electronicos, {
    foreignKey: 'ID_Categoria_Recursos_Electronicos',
    as: 'relacionesCategoria'
  });

  // Relación Recursos -> Relaciones (usa alias único)
  Recursos_Electronicos.hasMany(Rel_Categorias_Recursos_Electronicos, {
    foreignKey: 'ID_Recurso_Electronico',
    as: 'relacionesRecurso'
  });

  // Relación inversa Relaciones -> Categorias
  Rel_Categorias_Recursos_Electronicos.belongsTo(Categorias_Recursos_Electronicos, {
    foreignKey: 'ID_Categoria_Recursos_Electronicos',
    as: 'categoria'
  });

  // Relación inversa Relaciones -> Recursos
  Rel_Categorias_Recursos_Electronicos.belongsTo(Recursos_Electronicos, {
    foreignKey: 'ID_Recurso_Electronico',
    as: 'recurso'
  });

  relationsInitialized = true;
}
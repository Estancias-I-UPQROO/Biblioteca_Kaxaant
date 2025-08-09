import { Categorias_Recursos_Electronicos } from './Categorias_Recursos_Electronicos.model';
import { Eventos } from './Eventos.model';
import { Recursos_Electronicos } from './Recursos_Electronicos.model';
import { Rel_Categorias_Recursos_Electronicos } from './Rel_Categorias_Recursos_Electronicos.model';
import { SubEventos } from './SubEventos.model';

// 🔹 Definir relaciones aquí
Categorias_Recursos_Electronicos.hasMany(Rel_Categorias_Recursos_Electronicos, {
    foreignKey: 'ID_Categoria_Recursos_Electronicos'
});
Recursos_Electronicos.hasMany(Rel_Categorias_Recursos_Electronicos, {
    foreignKey: 'ID_Recurso_Electronico'
});
Rel_Categorias_Recursos_Electronicos.belongsTo(Categorias_Recursos_Electronicos, {
    foreignKey: 'ID_Categoria_Recursos_Electronicos'
});
Rel_Categorias_Recursos_Electronicos.belongsTo(Recursos_Electronicos, {
    foreignKey: 'ID_Recurso_Electronico'
});

Eventos.hasMany(SubEventos, { foreignKey: 'ID_Evento' });
SubEventos.belongsTo(Eventos, { foreignKey: 'ID_Evento' });

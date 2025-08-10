// RUTA: lib/types.ts o src/lib/types.ts

export interface SubEvento {
  ID_SubEvento: string;
  ID_Evento: string;
  Titulo: string;
  Imagen_URL: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evento {
  ID_Evento: string;
  Titulo: string;
  Descripcion: string;
  Imagen_URL: string;
  Activo: boolean;
  createdAt: string;
  updatedAt: string;
  SubEventos?: SubEvento[]; // El '?' indica que es opcional
}

export interface Hero {
  ID_Slider_Hero: string;
  Imagen_URL: string;
}
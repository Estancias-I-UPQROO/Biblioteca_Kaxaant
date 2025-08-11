export interface RecursosPorCategoria {
    ID_Rel_Categorias_Recursos_Electronicos: string;
    ID_Recurso_Electronico:                  string;
    ID_Categoria_Recursos_Electronicos:      string;
    createdAt:                               Date;
    updatedAt:                               Date;
    recurso:                                 Recurso;
}

export interface Recurso {
    ID_Recurso_Electronico: string;
    Nombre:                 string;
    Descripcion:            string;
    Imagen_URL:             string;
    Enlace_Pagina:          string;
    Activo:                 boolean;
    createdAt:              Date;
    updatedAt:              Date;
}

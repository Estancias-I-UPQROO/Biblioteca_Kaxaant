"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { RecursosElectronicosCard } from "@/components/RecursosElectronicosCard";
import { RecursosElectronicosGrid } from "@/components/RecursosElectronicosGrid";

type RelacionCategoriaRecurso = {
  ID_Rel_Categorias_Recursos_Electronicos: string;
  ID_Recurso_Electronico: string;
  ID_Categoria_Recursos_Electronicos: string;
  recurso: {
    ID_Recurso_Electronico: string;
    Nombre: string;
    Descripcion: string;
    Imagen_URL: string;
    Enlace_Pagina: string;
    Activo: boolean;
  };
};

type Categoria = {
  ID_Categoria_Recursos_Electronicos: string;
  Nombre: string;
  Activo: boolean;
};

export default function CategoriaPage() {
  const { id_categoria } = useParams();
  const router = useRouter();

  const [relaciones, setRelaciones] = useState<RelacionCategoriaRecurso[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loadingRecursos, setLoadingRecursos] = useState(true);
  const [loadingCategoria, setLoadingCategoria] = useState(true);
  const [errorRecursos, setErrorRecursos] = useState<string | null>(null);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id_categoria) return;

    axios
      .get(`http://localhost:4501/api/categorias-recursos-electronicos/get-categoria/${id_categoria}`)
      .then(({ data }: { data: Categoria }) => {
        if (!data.Activo) {
          router.push("/");
          return;
        }
        setCategoria(data);
        setLoadingCategoria(false);
      })
      .catch(() => router.push("/"));
  }, [id_categoria, router]);

  useEffect(() => {
    if (!id_categoria) return;
    axios
      .get(`http://localhost:4501/api/recursos-electronicos/get-recursos/${id_categoria}`)
      .then(({ data }) => {
        setRelaciones(data);
        setLoadingRecursos(false);
      })
      .catch((error) => {
        console.error("Error API:", error);
        setErrorRecursos(error.message);
        setLoadingRecursos(false);
      });
  }, [id_categoria]);

  console.log(relaciones)

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-center my-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
        {loadingCategoria ? "Cargando..." : categoria?.Nombre || "Categoría"}
      </h1>
      {loadingRecursos && <p>Cargando recursos...</p>}
      {errorRecursos && <p>Error: {errorRecursos}</p>}
      {!loadingRecursos && !errorRecursos && relaciones.length === 0 && (
        <p>No hay recursos para esta categoría.</p>
      )}

      {relaciones.length > 0 && (
        <RecursosElectronicosGrid>
          {
            relaciones.map((relacion, index) => (
              <RecursosElectronicosCard
                key={relacion.ID_Recurso_Electronico}
                title={relacion.recurso.Nombre}
                description={relacion.recurso.Descripcion}
                image={`http://localhost:4501${relacion.recurso.Imagen_URL}`}
                siteLink={relacion.recurso.Enlace_Pagina}
                index={index}
                expandedCardIndex={expandedCardIndex}
                setExpandedCardIndex={setExpandedCardIndex}
              />
            ))
          }
        </RecursosElectronicosGrid>
      )}
    </div>
  );
}

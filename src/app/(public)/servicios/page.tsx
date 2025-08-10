import React from 'react';
import {
  BookOpenIcon,
  LaptopIcon,
  RefreshCwIcon,
  MessageSquareIcon,
  ArrowRightIcon,
} from 'lucide-react';
// 1. Cambiamos la importación de Link
import Link from 'next/link';

// --- El componente principal de la página ---
// 2. Renombramos y exportamos por defecto
export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-14 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        {/* Aquí puedes agregar un título si lo deseas */}
       
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 mb-10">
          {cards.slice(3, 5).map((card) => (
            <ServiceCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {cards.slice(0, 3).map((card) => (
            <ServiceCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </main>
  );
};

// --- Componentes y datos (pueden estar en el mismo archivo o separarse) ---

type ServiceCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: React.ReactNode;
  link: string | null;
  bgImage: string | null;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, link, bgImage }) => {
  const hasImageBg = !!bgImage;

  return (
    <div className={`
      relative border border-orange-50 hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden
      flex flex-col h-full shadow-sm ${hasImageBg ? '' : 'bg-white'}
    `}>
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt={`Fondo para ${title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 p-5 bg-orange-50">
          <Icon className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-bold text-orange-600">{title}</h2>
        </div>

        <div className={`
          flex-grow px-5 py-4 text-sm leading-relaxed
          ${hasImageBg
            ? 'text-white bg-black/20 backdrop-blur-[1px]'
            : 'text-gray-700 bg-white'
          }
        `}>
          {description}
        </div>

        {link && (
          <div className={`p-5 mt-auto ${hasImageBg ? 'bg-black/20' : 'bg-white'}`}>
            {/* 3. Cambiamos 'to' por 'href' */}
            <Link
              href={link}
              className="w-full inline-flex items-center justify-center gap-2 text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl font-medium shadow-md"
            >
              Ir al formulario <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Los datos se quedan igual.
const cards: ServiceCardProps[] = [
  {
    icon: BookOpenIcon,
    title: 'Préstamo de material bibliográfico',
    description: (
      <p>
        Este servicio está disponible para <strong>alumnos y comunidad UPQROO</strong> con matrícula vigente. Tienes la posibilidad de llevarte hasta <strong>tres libros</strong> (excepto el ejemplar 1), por <strong>tres días naturales</strong>; en caso de requerirlos por más tiempo, tienes derecho a hacer <strong>dos renovaciones más</strong>. La renovación deberá solicitarse el <strong>día de vencimiento</strong> directo en biblioteca o a través de la renovación en línea.
      </p>
    ),
    link: null,
    bgImage: '/prestamo.jpg'
  },
  {
    icon: LaptopIcon,
    title: 'Préstamo de equipo de cómputo',
    description: (
      <p>
        En apoyo a nuestra comunidad académica la Biblioteca Kaxáant ofrece el préstamo de equipos de cómputo con <strong>fines académicos</strong>; para hacer uso de ellos deberán registrarse en la bitácora.
      </p>
    ),
    link: null,
    bgImage: '/computo.jpg'
  },
  {
    icon: BookOpenIcon,
    title: 'Formación de usuarios',
    description: (
      <p>
        Se brinda información general sobre el uso de la Biblioteca física y digital. La capacitación es de <strong>una hora</strong> aproximadamente y se programa <strong>previa cita</strong>.
      </p>
    ),
    link: null,
    bgImage: '/formacion.jpg'
  },
  {
    icon: RefreshCwIcon,
    title: 'Renovación en línea',
    description: (
      <p>
        Te permite renovar tus préstamos desde tu domicilio, siempre que la renovación del préstamo se encuentre <strong>exactamente los días de vencimiento</strong>.
      </p>
    ),
    link: '/renovacion',
    bgImage: '/Renovacion.png'
  },
  {
    icon: MessageSquareIcon,
    title: 'Sugerencias de material de compra',
    description: (
      <p>
        La Biblioteca acepta sugerencias de material bibliográfico que sea de interés para la <strong>comunidad UPQROO</strong>, con el objetivo de constituir un acervo amplio en apoyo a la comunidad universitaria.
      </p>
    ),
    link: '/solicitud-compra',
    bgImage: '/Solicitud.png'
  },
];
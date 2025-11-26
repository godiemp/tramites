'use client';

import Link from 'next/link';
import { Tramite, formatPrecio } from '@/lib/tramites';

interface TramiteCardProps {
  tramite: Tramite;
  onComingSoon?: (tramite: Tramite) => void;
}

export default function TramiteCard({ tramite, onComingSoon }: TramiteCardProps) {
  const isDisponible = tramite.estado === 'disponible';

  const handleClick = () => {
    if (!isDisponible && onComingSoon) {
      onComingSoon(tramite);
    }
  };

  const CardContent = () => (
    <>
      <div className="flex justify-between items-start mb-3">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isDisponible
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isDisponible ? 'Disponible' : 'Próximamente'}
        </span>
        <span className="text-sm font-semibold text-blue-600">
          {formatPrecio(tramite.precio)}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {tramite.nombre}
      </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {tramite.descripcion}
      </p>

      <div className="mt-auto">
        <span
          className={`inline-flex items-center gap-2 text-sm font-medium ${
            isDisponible ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          {isDisponible ? 'Comenzar' : 'Más información'}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </>
  );

  if (isDisponible) {
    return (
      <Link
        href={`/tramite/${tramite.slug}`}
        className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 h-full flex flex-col"
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 h-full flex flex-col text-left w-full opacity-75 hover:opacity-100"
    >
      <CardContent />
    </button>
  );
}

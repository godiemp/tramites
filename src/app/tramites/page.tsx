'use client';

import { useState } from 'react';
import TramiteCard from '@/components/TramiteCard';
import ComingSoonModal from '@/components/ComingSoonModal';
import {
  tramites,
  categorias,
  TramiteCategory,
  Tramite,
  getTramitesByCategoria,
} from '@/lib/tramites';

export default function TramitesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<TramiteCategory | 'todos'>('todos');

  const handleComingSoon = (tramite: Tramite) => {
    setSelectedTramite(tramite);
    setModalOpen(true);
  };

  const categoriasArray = Object.entries(categorias) as [TramiteCategory, string][];

  const tramitesFiltrados =
    filtroCategoria === 'todos'
      ? tramites
      : getTramitesByCategoria(filtroCategoria);

  const tramitesDisponibles = tramitesFiltrados.filter(
    (t) => t.estado === 'disponible'
  ).length;
  const tramitesProximamente = tramitesFiltrados.filter(
    (t) => t.estado === 'proximamente'
  ).length;

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Catálogo de Trámites
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Encuentra el documento que necesitas. Tenemos {tramites.length} trámites
            disponibles o próximamente disponibles para ti.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-200">
            <button
              onClick={() => setFiltroCategoria('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroCategoria === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({tramites.length})
            </button>
            {categoriasArray.map(([key, nombre]) => {
              const count = getTramitesByCategoria(key).length;
              return (
                <button
                  key={key}
                  onClick={() => setFiltroCategoria(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtroCategoria === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {nombre} ({count})
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">
                {tramitesDisponibles} disponible{tramitesDisponibles !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="text-gray-600">
                {tramitesProximamente} próximamente
              </span>
            </div>
          </div>

          {/* Grid by categories or all */}
          {filtroCategoria === 'todos' ? (
            // Show grouped by category
            <div className="space-y-12">
              {categoriasArray.map(([key, nombre]) => {
                const tramitesCategoria = getTramitesByCategoria(key);
                if (tramitesCategoria.length === 0) return null;
                return (
                  <div key={key}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      {nombre}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tramitesCategoria.map((tramite) => (
                        <TramiteCard
                          key={tramite.id}
                          tramite={tramite}
                          onComingSoon={handleComingSoon}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Show flat grid for selected category
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tramitesFiltrados.map((tramite) => (
                <TramiteCard
                  key={tramite.id}
                  tramite={tramite}
                  onComingSoon={handleComingSoon}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tramiteNombre={selectedTramite?.nombre || ''}
      />
    </>
  );
}

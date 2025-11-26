'use client';

import { useState } from 'react';
import Link from 'next/link';
import TramiteCard from '@/components/TramiteCard';
import ComingSoonModal from '@/components/ComingSoonModal';
import { getTramitesDisponibles, Tramite } from '@/lib/tramites';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);

  const tramitesDisponibles = getTramitesDisponibles();
  // Mostrar solo los 3 principales para el home
  const tramitesDestacados = tramitesDisponibles.slice(0, 3);

  const handleComingSoon = (tramite: Tramite) => {
    setSelectedTramite(tramite);
    setModalOpen(true);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Trámites y documentos legales{' '}
              <span className="text-blue-600">en minutos</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sin abogados ni lenguaje complicado. Genera contratos, declaraciones
              y documentos legales de forma rápida, simple y guiada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tramites"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Ver trámites disponibles
              </Link>
              <a
                href="#como-funciona"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                ¿Cómo funciona?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En solo 3 pasos tendrás tu documento listo para usar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Elige tu trámite
              </h3>
              <p className="text-gray-600">
                Selecciona el documento que necesitas de nuestro catálogo. Tenemos
                contratos, declaraciones y más.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Rellena el formulario
              </h3>
              <p className="text-gray-600">
                Completa los datos paso a paso. Te guiamos con explicaciones
                simples y claras en cada campo.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Descarga tu documento
              </h3>
              <p className="text-gray-600">
                Revisa el resumen, realiza el pago y descarga tu documento listo
                para imprimir o enviar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tramites */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trámites más solicitados
            </h2>
            <p className="text-lg text-gray-600">
              Comienza ahora con nuestros documentos más populares
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {tramitesDestacados.map((tramite) => (
              <TramiteCard
                key={tramite.id}
                tramite={tramite}
                onComingSoon={handleComingSoon}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/tramites"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Ver todos los trámites
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para simplificar tus trámites?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Desde $2.490 por documento. Sin suscripciones ni costos ocultos.
          </p>
          <Link
            href="/tramites"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-50 transition-colors shadow-lg"
          >
            Comenzar ahora
          </Link>
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

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white">TramiteZoom</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Trámites y documentos legales en minutos, sin abogados ni lenguaje
              complicado. Generamos tus documentos de forma rápida, simple y
              guiada.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Trámites</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tramite/contrato-laboral"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contrato Laboral
                </Link>
              </li>
              <li>
                <Link
                  href="/tramite/anexo-contrato"
                  className="hover:text-blue-400 transition-colors"
                >
                  Anexo de Contrato
                </Link>
              </li>
              <li>
                <Link
                  href="/tramite/declaracion-jurada"
                  className="hover:text-blue-400 transition-colors"
                >
                  Declaración Jurada
                </Link>
              </li>
              <li>
                <Link
                  href="/tramites"
                  className="hover:text-blue-400 transition-colors"
                >
                  Ver todos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>contacto@tramitezoom.cl</li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300">Aviso importante:</strong> Esta
              herramienta entrega documentos generados automáticamente en base a
              la información que ingresas. No constituye asesoría jurídica ni
              reemplaza la revisión de un abogado. Los documentos son una guía
              que debe ser revisada según tu situación particular.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} TramiteZoom. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-400 transition-colors"
              >
                Términos de uso
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-400 transition-colors"
              >
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

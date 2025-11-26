export type TramiteStatus = 'disponible' | 'proximamente';

export type TramiteCategory =
  | 'laboral'
  | 'comercial'
  | 'migracion'
  | 'vivienda'
  | 'varios';

export interface Tramite {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: TramiteCategory;
  estado: TramiteStatus;
  precio: number;
  slug: string;
}

export const categorias: Record<TramiteCategory, string> = {
  laboral: 'Laboral',
  comercial: 'Comercial / Pymes',
  migracion: 'Migración / Extranjeros',
  vivienda: 'Vivienda / Arriendo',
  varios: 'Varios',
};

export const tramites: Tramite[] = [
  // Laboral - Disponibles
  {
    id: 'contrato-laboral',
    nombre: 'Contrato Laboral',
    descripcion: 'Genera un contrato de trabajo indefinido o a plazo fijo con todos los campos requeridos por la ley chilena.',
    categoria: 'laboral',
    estado: 'disponible',
    precio: 3990,
    slug: 'contrato-laboral',
  },
  {
    id: 'anexo-contrato',
    nombre: 'Anexo de Contrato',
    descripcion: 'Modifica cláusulas de un contrato existente: sueldo, funciones, jornada o lugar de trabajo.',
    categoria: 'laboral',
    estado: 'disponible',
    precio: 2990,
    slug: 'anexo-contrato',
  },
  {
    id: 'finiquito',
    nombre: 'Finiquito',
    descripcion: 'Documento de término de relación laboral con el cálculo de indemnizaciones correspondientes.',
    categoria: 'laboral',
    estado: 'proximamente',
    precio: 4990,
    slug: 'finiquito',
  },
  {
    id: 'carta-aviso-termino',
    nombre: 'Carta de Aviso de Término',
    descripcion: 'Notificación formal de término de contrato de trabajo según la normativa vigente.',
    categoria: 'laboral',
    estado: 'proximamente',
    precio: 2490,
    slug: 'carta-aviso-termino',
  },
  {
    id: 'carta-amonestacion',
    nombre: 'Carta de Amonestación',
    descripcion: 'Documento formal para registrar faltas laborales y advertencias al trabajador.',
    categoria: 'laboral',
    estado: 'proximamente',
    precio: 1990,
    slug: 'carta-amonestacion',
  },
  {
    id: 'reglamento-interno',
    nombre: 'Reglamento Interno',
    descripcion: 'Reglamento interno de orden, higiene y seguridad para tu empresa.',
    categoria: 'laboral',
    estado: 'proximamente',
    precio: 14990,
    slug: 'reglamento-interno',
  },

  // Comercial / Pymes
  {
    id: 'solicitud-patente-municipal',
    nombre: 'Solicitud de Patente Municipal',
    descripcion: 'Documento para solicitar patente comercial ante la municipalidad correspondiente.',
    categoria: 'comercial',
    estado: 'proximamente',
    precio: 3990,
    slug: 'solicitud-patente-municipal',
  },
  {
    id: 'carta-cambio-giro',
    nombre: 'Carta de Cambio de Giro',
    descripcion: 'Solicitud de modificación de giro comercial a la municipalidad.',
    categoria: 'comercial',
    estado: 'proximamente',
    precio: 2990,
    slug: 'carta-cambio-giro',
  },
  {
    id: 'solicitud-permiso-sanitario',
    nombre: 'Solicitud de Permiso Sanitario',
    descripcion: 'Documento para solicitar autorización sanitaria ante la SEREMI de Salud.',
    categoria: 'comercial',
    estado: 'proximamente',
    precio: 3990,
    slug: 'solicitud-permiso-sanitario',
  },

  // Migración / Extranjeros
  {
    id: 'carta-residencia',
    nombre: 'Carta de Residencia',
    descripcion: 'Declaración de residencia para trámites migratorios y otros usos.',
    categoria: 'migracion',
    estado: 'proximamente',
    precio: 2990,
    slug: 'carta-residencia',
  },
  {
    id: 'declaracion-sustento-economico',
    nombre: 'Declaración de Sustento Económico',
    descripcion: 'Declaración jurada que acredita que una persona sustenta económicamente a otra.',
    categoria: 'migracion',
    estado: 'disponible',
    precio: 2990,
    slug: 'declaracion-jurada',
  },
  {
    id: 'carta-invitacion',
    nombre: 'Carta de Invitación',
    descripcion: 'Carta para invitar a un extranjero a visitar Chile, requerida para visa de turismo.',
    categoria: 'migracion',
    estado: 'proximamente',
    precio: 2990,
    slug: 'carta-invitacion',
  },
  {
    id: 'declaracion-vinculo-familiar',
    nombre: 'Declaración de Vínculo Familiar',
    descripcion: 'Declaración jurada que acredita relación familiar para trámites migratorios.',
    categoria: 'migracion',
    estado: 'proximamente',
    precio: 2990,
    slug: 'declaracion-vinculo-familiar',
  },

  // Vivienda / Arriendo
  {
    id: 'declaracion-ingresos-arriendo',
    nombre: 'Declaración de Ingresos para Arriendo',
    descripcion: 'Declaración jurada de ingresos para presentar al arrendador.',
    categoria: 'vivienda',
    estado: 'disponible',
    precio: 2490,
    slug: 'declaracion-jurada',
  },
  {
    id: 'carta-recomendacion-arrendatario',
    nombre: 'Carta de Recomendación de Arrendatario',
    descripcion: 'Carta de referencia para un arrendatario emitida por un arrendador anterior.',
    categoria: 'vivienda',
    estado: 'proximamente',
    precio: 1990,
    slug: 'carta-recomendacion-arrendatario',
  },

  // Varios
  {
    id: 'declaracion-jurada-generica',
    nombre: 'Declaración Jurada Simple',
    descripcion: 'Declaración jurada genérica adaptable a distintos propósitos: domicilio, ingresos, sustento económico.',
    categoria: 'varios',
    estado: 'disponible',
    precio: 2490,
    slug: 'declaracion-jurada',
  },
  {
    id: 'declaracion-extravio',
    nombre: 'Declaración de Extravío de Documento',
    descripcion: 'Declaración jurada por pérdida o extravío de documentos importantes.',
    categoria: 'varios',
    estado: 'proximamente',
    precio: 1990,
    slug: 'declaracion-extravio',
  },
  {
    id: 'carta-reclamo-servicio-publico',
    nombre: 'Carta de Reclamo a Servicio Público',
    descripcion: 'Reclamo formal dirigido a instituciones públicas o empresas de servicios.',
    categoria: 'varios',
    estado: 'proximamente',
    precio: 2490,
    slug: 'carta-reclamo-servicio-publico',
  },
];

export function getTramitesByCategoria(categoria: TramiteCategory): Tramite[] {
  return tramites.filter(t => t.categoria === categoria);
}

export function getTramitesDisponibles(): Tramite[] {
  return tramites.filter(t => t.estado === 'disponible');
}

export function getTramiteById(id: string): Tramite | undefined {
  return tramites.find(t => t.id === id);
}

export function formatPrecio(precio: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(precio);
}

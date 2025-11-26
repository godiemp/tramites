'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generatePdf } from '@/lib/generatePdf';

type TipoDeclaracion = 'domicilio' | 'ingresos' | 'sustento' | 'generica';

interface FormData {
  // Declarante
  nombreDeclarante: string;
  rutDeclarante: string;
  nacionalidad: string;
  estadoCivil: string;
  profesion: string;
  domicilio: string;
  comuna: string;
  region: string;

  // Declaración
  tipoDeclaracion: TipoDeclaracion;
  ciudad: string;
  fecha: string;

  // Campos específicos según tipo
  // Domicilio
  direccionDomicilio: string;
  comunaDomicilio: string;
  tiempoResidencia: string;

  // Ingresos
  tipoIngreso: string;
  montoIngresos: string;
  fuenteIngresos: string;

  // Sustento
  nombreBeneficiario: string;
  rutBeneficiario: string;
  relacionBeneficiario: string;
  tipoApoyo: string;

  // Genérica
  textoLibre: string;
}

const initialFormData: FormData = {
  nombreDeclarante: '',
  rutDeclarante: '',
  nacionalidad: 'Chilena',
  estadoCivil: 'Soltero/a',
  profesion: '',
  domicilio: '',
  comuna: '',
  region: 'Metropolitana',
  tipoDeclaracion: 'domicilio',
  ciudad: 'Santiago',
  fecha: new Date().toISOString().split('T')[0],
  direccionDomicilio: '',
  comunaDomicilio: '',
  tiempoResidencia: '1 año',
  tipoIngreso: 'Sueldo mensual',
  montoIngresos: '',
  fuenteIngresos: '',
  nombreBeneficiario: '',
  rutBeneficiario: '',
  relacionBeneficiario: 'Familiar directo',
  tipoApoyo: 'Económico y habitacional',
  textoLibre: '',
};

const tiposDeclaracion: { value: TipoDeclaracion; label: string; descripcion: string }[] = [
  { value: 'domicilio', label: 'Declaración de Domicilio', descripcion: 'Acredita tu lugar de residencia actual' },
  { value: 'ingresos', label: 'Declaración de Ingresos', descripcion: 'Acredita tus ingresos mensuales' },
  { value: 'sustento', label: 'Declaración de Sustento Económico', descripcion: 'Acredita que sustentas a otra persona' },
  { value: 'generica', label: 'Declaración Genérica', descripcion: 'Texto libre para otros fines' },
];

export default function DeclaracionJuradaPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatRut = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, '');
    if (cleaned.length <= 1) return cleaned;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedBody}-${dv}`;
  };

  const handleRutChange = (field: keyof FormData, value: string) => {
    const formatted = formatRut(value);
    updateForm(field, formatted);
  };

  const formatCurrency = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handlePayment = () => {
    setShowPayment(true);
    setTimeout(() => {
      setPaymentComplete(true);
    }, 1500);
  };

  const formatFecha = (fecha: string) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getContenidoDeclaracion = () => {
    switch (formData.tipoDeclaracion) {
      case 'domicilio':
        return `Que mi domicilio actual se encuentra ubicado en ${formData.direccionDomicilio}, comuna de ${formData.comunaDomicilio}, donde resido de forma permanente desde hace ${formData.tiempoResidencia}.

Declaro que esta información es verídica y que puedo acreditarla si fuese requerido.`;

      case 'ingresos':
        return `Que percibo ingresos mensuales por concepto de ${formData.tipoIngreso.toLowerCase()}, provenientes de ${formData.fuenteIngresos}, por un monto aproximado de $${formatCurrency(formData.montoIngresos)} (${formData.montoIngresos} pesos chilenos) mensuales.

Declaro que esta información es verídica y que puedo acreditarla mediante la documentación correspondiente si fuese requerido.`;

      case 'sustento':
        return `Que proporciono sustento económico de manera regular a ${formData.nombreBeneficiario}, RUT ${formData.rutBeneficiario}, quien es mi ${formData.relacionBeneficiario.toLowerCase()}.

El tipo de apoyo que brindo es de carácter ${formData.tipoApoyo.toLowerCase()}, de forma permanente y sostenida.

Declaro que esta información es verídica y asumo la responsabilidad legal que corresponda en caso de falsedad.`;

      case 'generica':
        return formData.textoLibre;
    }
  };

  const generatePreview = () => {
    const titulo = tiposDeclaracion.find(t => t.value === formData.tipoDeclaracion)?.label.toUpperCase() || 'DECLARACIÓN JURADA SIMPLE';

    return `
${titulo}

Yo, ${formData.nombreDeclarante}, RUT ${formData.rutDeclarante}, de nacionalidad ${formData.nacionalidad}, estado civil ${formData.estadoCivil}, de profesión u oficio ${formData.profesion}, con domicilio en ${formData.domicilio}, comuna de ${formData.comuna}, Región ${formData.region},

DECLARO BAJO JURAMENTO:

${getContenidoDeclaracion()}

La presente declaración jurada se extiende para ser presentada ante quien corresponda y para los fines que el interesado estime convenientes.

Para constancia, firmo la presente declaración en ${formData.ciudad}, a ${formatFecha(formData.fecha)}.



_________________________
${formData.nombreDeclarante}
RUT: ${formData.rutDeclarante}
    `.trim();
  };

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Documento generado con éxito!
          </h1>
          <p className="text-gray-600 mb-8">
            Tu declaración jurada está lista. Descarga el documento en formato PDF.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
              {generatePreview()}
            </pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const tipoLabel = tiposDeclaracion.find(
                  (t) => t.value === formData.tipoDeclaracion
                )?.label || 'DECLARACION JURADA SIMPLE';
                generatePdf({
                  title: tipoLabel.toUpperCase(),
                  content: generatePreview(),
                  fileName: `declaracion-jurada-${formData.rutDeclarante || 'documento'}`,
                });
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Descargar PDF
            </button>
            <Link
              href="/tramites"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Hacer otro trámite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/tramites"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a trámites
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Declaración Jurada Simple
        </h1>
        <p className="text-gray-600">
          Genera una declaración jurada para distintos propósitos: domicilio,
          ingresos, sustento económico o texto libre.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            <span
              className={`ml-2 hidden sm:inline ${
                step >= s ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {s === 1 && 'Datos personales'}
              {s === 2 && 'Contenido'}
              {s === 3 && 'Revisión'}
            </span>
            {s < 3 && (
              <div
                className={`w-12 sm:w-24 h-1 mx-2 ${
                  step > s ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Datos del Declarante
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.nombreDeclarante}
                  onChange={(e) => updateForm('nombreDeclarante', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nombre y apellidos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUT
                </label>
                <input
                  type="text"
                  value={formData.rutDeclarante}
                  onChange={(e) => handleRutChange('rutDeclarante', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="12.345.678-9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nacionalidad
                </label>
                <select
                  value={formData.nacionalidad}
                  onChange={(e) => updateForm('nacionalidad', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Chilena">Chilena</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Peruana">Peruana</option>
                  <option value="Boliviana">Boliviana</option>
                  <option value="Colombiana">Colombiana</option>
                  <option value="Venezolana">Venezolana</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Civil
                </label>
                <select
                  value={formData.estadoCivil}
                  onChange={(e) => updateForm('estadoCivil', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Soltero/a">Soltero/a</option>
                  <option value="Casado/a">Casado/a</option>
                  <option value="Divorciado/a">Divorciado/a</option>
                  <option value="Viudo/a">Viudo/a</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profesión u Oficio
                </label>
                <input
                  type="text"
                  value={formData.profesion}
                  onChange={(e) => updateForm('profesion', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: Ingeniero, Comerciante, Estudiante"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domicilio
                </label>
                <input
                  type="text"
                  value={formData.domicilio}
                  onChange={(e) => updateForm('domicilio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Calle, número, depto/casa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comuna
                </label>
                <input
                  type="text"
                  value={formData.comuna}
                  onChange={(e) => updateForm('comuna', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: Santiago, Providencia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Región
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => updateForm('region', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Metropolitana">Metropolitana</option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Biobío">Biobío</option>
                  <option value="Maule">Maule</option>
                  <option value="Araucanía">La Araucanía</option>
                  <option value="O'Higgins">O&apos;Higgins</option>
                  <option value="Los Lagos">Los Lagos</option>
                  <option value="Coquimbo">Coquimbo</option>
                  <option value="Antofagasta">Antofagasta</option>
                  <option value="Los Ríos">Los Ríos</option>
                  <option value="Atacama">Atacama</option>
                  <option value="Tarapacá">Tarapacá</option>
                  <option value="Arica y Parinacota">Arica y Parinacota</option>
                  <option value="Ñuble">Ñuble</option>
                  <option value="Aysén">Aysén</option>
                  <option value="Magallanes">Magallanes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tipo de Declaración
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {tiposDeclaracion.map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => updateForm('tipoDeclaracion', tipo.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.tipoDeclaracion === tipo.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{tipo.label}</span>
                  <p className="text-sm text-gray-500 mt-1">{tipo.descripcion}</p>
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => updateForm('ciudad', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Santiago"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => updateForm('fecha', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Campos según tipo */}
            {formData.tipoDeclaracion === 'domicilio' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Datos del domicilio a declarar</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección del Domicilio
                  </label>
                  <input
                    type="text"
                    value={formData.direccionDomicilio}
                    onChange={(e) => updateForm('direccionDomicilio', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Calle, número, depto"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comuna
                    </label>
                    <input
                      type="text"
                      value={formData.comunaDomicilio}
                      onChange={(e) => updateForm('comunaDomicilio', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Comuna"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiempo de Residencia
                    </label>
                    <select
                      value={formData.tiempoResidencia}
                      onChange={(e) => updateForm('tiempoResidencia', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="menos de 6 meses">Menos de 6 meses</option>
                      <option value="6 meses">6 meses</option>
                      <option value="1 año">1 año</option>
                      <option value="2 años">2 años</option>
                      <option value="más de 2 años">Más de 2 años</option>
                      <option value="más de 5 años">Más de 5 años</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoDeclaracion === 'ingresos' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Datos de ingresos</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Ingreso
                    </label>
                    <select
                      value={formData.tipoIngreso}
                      onChange={(e) => updateForm('tipoIngreso', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="Sueldo mensual">Sueldo mensual</option>
                      <option value="Honorarios">Honorarios</option>
                      <option value="Pensión">Pensión</option>
                      <option value="Arriendos">Arriendos</option>
                      <option value="Actividad independiente">Actividad independiente</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto Mensual (CLP)
                    </label>
                    <input
                      type="text"
                      value={formData.montoIngresos}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        updateForm('montoIngresos', value);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="1000000"
                    />
                    {formData.montoIngresos && (
                      <p className="text-sm text-gray-500 mt-1">
                        ${formatCurrency(formData.montoIngresos)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuente de Ingresos
                  </label>
                  <input
                    type="text"
                    value={formData.fuenteIngresos}
                    onChange={(e) => updateForm('fuenteIngresos', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ej: Empresa ABC Ltda., Actividad comercial propia"
                  />
                </div>
              </div>
            )}

            {formData.tipoDeclaracion === 'sustento' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Datos del beneficiario</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Beneficiario
                    </label>
                    <input
                      type="text"
                      value={formData.nombreBeneficiario}
                      onChange={(e) => updateForm('nombreBeneficiario', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUT del Beneficiario
                    </label>
                    <input
                      type="text"
                      value={formData.rutBeneficiario}
                      onChange={(e) => handleRutChange('rutBeneficiario', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="12.345.678-9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relación con el Beneficiario
                    </label>
                    <select
                      value={formData.relacionBeneficiario}
                      onChange={(e) => updateForm('relacionBeneficiario', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="Familiar directo">Familiar directo</option>
                      <option value="Cónyuge">Cónyuge</option>
                      <option value="Hijo/a">Hijo/a</option>
                      <option value="Padre/Madre">Padre/Madre</option>
                      <option value="Hermano/a">Hermano/a</option>
                      <option value="Otro familiar">Otro familiar</option>
                      <option value="Persona a cargo">Persona a cargo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Apoyo
                    </label>
                    <select
                      value={formData.tipoApoyo}
                      onChange={(e) => updateForm('tipoApoyo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="Económico y habitacional">Económico y habitacional</option>
                      <option value="Solo económico">Solo económico</option>
                      <option value="Solo habitacional">Solo habitacional</option>
                      <option value="Alimentación y estudios">Alimentación y estudios</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoDeclaracion === 'generica' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Contenido de la declaración</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto de la Declaración
                  </label>
                  <textarea
                    value={formData.textoLibre}
                    onChange={(e) => updateForm('textoLibre', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Escribe aquí el contenido de tu declaración jurada..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Escribe en primera persona lo que deseas declarar. Ejemplo:
                    &quot;Que no tengo antecedentes penales vigentes...&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && !showPayment && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vista Previa de la Declaración
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {generatePreview()}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Aviso:</strong> Una declaración jurada tiene valor legal.
                Asegúrate de que toda la información sea correcta y verdadera.
              </p>
            </div>
          </div>
        )}

        {showPayment && !paymentComplete && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Procesando pago...</p>
          </div>
        )}

        {/* Navigation */}
        {!showPayment && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Anterior
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Siguiente
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handlePayment}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                Pagar $2.490 con Webpay (Demo)
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

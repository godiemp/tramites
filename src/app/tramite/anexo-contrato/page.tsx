'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generatePdf } from '@/lib/generatePdf';

type TipoCambio = 'sueldo' | 'funciones' | 'jornada' | 'lugar' | 'otras';

interface FormData {
  // Empresa
  nombreEmpresa: string;
  rutEmpresa: string;
  representanteLegal: string;
  rutRepresentante: string;

  // Trabajador
  nombreTrabajador: string;
  rutTrabajador: string;

  // Contrato Original
  fechaContratoOriginal: string;

  // Cambios
  tipoCambio: TipoCambio;
  fechaVigencia: string;

  // Detalles según tipo
  sueldoAnterior: string;
  sueldoNuevo: string;
  funcionesAnteriores: string;
  funcionesNuevas: string;
  jornadaAnterior: string;
  jornadaNueva: string;
  lugarAnterior: string;
  lugarNuevo: string;
  otraClausulaDescripcion: string;
  otraClausulaAnterior: string;
  otraClausulaNueva: string;
}

const initialFormData: FormData = {
  nombreEmpresa: '',
  rutEmpresa: '',
  representanteLegal: '',
  rutRepresentante: '',
  nombreTrabajador: '',
  rutTrabajador: '',
  fechaContratoOriginal: '',
  tipoCambio: 'sueldo',
  fechaVigencia: '',
  sueldoAnterior: '',
  sueldoNuevo: '',
  funcionesAnteriores: '',
  funcionesNuevas: '',
  jornadaAnterior: '45',
  jornadaNueva: '45',
  lugarAnterior: '',
  lugarNuevo: '',
  otraClausulaDescripcion: '',
  otraClausulaAnterior: '',
  otraClausulaNueva: '',
};

const tiposCambio: { value: TipoCambio; label: string; descripcion: string }[] = [
  { value: 'sueldo', label: 'Cambio de Sueldo', descripcion: 'Modificar la remuneración mensual' },
  { value: 'funciones', label: 'Cambio de Funciones', descripcion: 'Modificar el cargo o tareas' },
  { value: 'jornada', label: 'Cambio de Jornada', descripcion: 'Modificar horas de trabajo' },
  { value: 'lugar', label: 'Cambio de Lugar de Trabajo', descripcion: 'Modificar ubicación laboral' },
  { value: 'otras', label: 'Otras Cláusulas', descripcion: 'Modificar otras condiciones' },
];

export default function AnexoContratoPage() {
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

  const getDetallesCambio = () => {
    switch (formData.tipoCambio) {
      case 'sueldo':
        return {
          titulo: 'MODIFICACIÓN DE REMUNERACIÓN',
          anterior: `$${formatCurrency(formData.sueldoAnterior)} mensuales brutos`,
          nuevo: `$${formatCurrency(formData.sueldoNuevo)} mensuales brutos`,
        };
      case 'funciones':
        return {
          titulo: 'MODIFICACIÓN DE FUNCIONES',
          anterior: formData.funcionesAnteriores,
          nuevo: formData.funcionesNuevas,
        };
      case 'jornada':
        return {
          titulo: 'MODIFICACIÓN DE JORNADA',
          anterior: `${formData.jornadaAnterior} horas semanales`,
          nuevo: `${formData.jornadaNueva} horas semanales`,
        };
      case 'lugar':
        return {
          titulo: 'MODIFICACIÓN DE LUGAR DE TRABAJO',
          anterior: formData.lugarAnterior,
          nuevo: formData.lugarNuevo,
        };
      case 'otras':
        return {
          titulo: `MODIFICACIÓN: ${formData.otraClausulaDescripcion.toUpperCase()}`,
          anterior: formData.otraClausulaAnterior,
          nuevo: formData.otraClausulaNueva,
        };
    }
  };

  const generatePreview = () => {
    const detalles = getDetallesCambio();

    return `
ANEXO DE CONTRATO DE TRABAJO

En Santiago, a ${formatFecha(formData.fechaVigencia)}, entre:

EMPLEADOR:
${formData.nombreEmpresa}, RUT ${formData.rutEmpresa}, representada legalmente por ${formData.representanteLegal}, RUT ${formData.rutRepresentante}, en adelante "el Empleador".

TRABAJADOR:
${formData.nombreTrabajador}, RUT ${formData.rutTrabajador}, en adelante "el Trabajador".

Las partes acuerdan modificar el contrato de trabajo suscrito con fecha ${formatFecha(formData.fechaContratoOriginal)}, en los términos que a continuación se indican:

${detalles.titulo}

Se modifica la cláusula correspondiente del contrato de trabajo en los siguientes términos:

CONDICIÓN ANTERIOR:
${detalles.anterior}

NUEVA CONDICIÓN:
${detalles.nuevo}

VIGENCIA:
El presente anexo entrará en vigencia a contar del ${formatFecha(formData.fechaVigencia)}.

CLÁUSULA FINAL:
Las demás estipulaciones del contrato de trabajo se mantienen vigentes sin modificación alguna.

Se firma el presente anexo en dos ejemplares, quedando uno en poder de cada parte.


_________________________          _________________________
      EMPLEADOR                         TRABAJADOR
${formData.representanteLegal}      ${formData.nombreTrabajador}
RUT: ${formData.rutRepresentante}      RUT: ${formData.rutTrabajador}
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
            Tu anexo de contrato está listo. Descarga el documento en formato PDF.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
              {generatePreview()}
            </pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                generatePdf({
                  title: 'ANEXO DE CONTRATO DE TRABAJO',
                  content: generatePreview(),
                  fileName: `anexo-contrato-${formData.rutTrabajador || 'documento'}`,
                })
              }
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
          Anexo de Contrato
        </h1>
        <p className="text-gray-600">
          Modifica cláusulas de un contrato de trabajo existente: sueldo,
          funciones, jornada o lugar de trabajo.
        </p>
      </div>

      {/* Progress Steps */}
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
              {s === 1 && 'Partes'}
              {s === 2 && 'Modificación'}
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
          <div className="space-y-8">
            {/* Empresa */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Datos del Empleador
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre o Razón Social
                  </label>
                  <input
                    type="text"
                    value={formData.nombreEmpresa}
                    onChange={(e) => updateForm('nombreEmpresa', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ej: Comercial Los Andes SpA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUT Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.rutEmpresa}
                    onChange={(e) => handleRutChange('rutEmpresa', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="76.123.456-7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Representante Legal
                  </label>
                  <input
                    type="text"
                    value={formData.representanteLegal}
                    onChange={(e) => updateForm('representanteLegal', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUT Representante
                  </label>
                  <input
                    type="text"
                    value={formData.rutRepresentante}
                    onChange={(e) => handleRutChange('rutRepresentante', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>
            </div>

            {/* Trabajador */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Datos del Trabajador
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.nombreTrabajador}
                    onChange={(e) => updateForm('nombreTrabajador', e.target.value)}
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
                    value={formData.rutTrabajador}
                    onChange={(e) => handleRutChange('rutTrabajador', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>
            </div>

            {/* Contrato Original */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contrato Original
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha del Contrato Original
                </label>
                <input
                  type="date"
                  value={formData.fechaContratoOriginal}
                  onChange={(e) => updateForm('fechaContratoOriginal', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Indica la fecha en que se firmó el contrato que será modificado.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tipo de Modificación
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {tiposCambio.map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => updateForm('tipoCambio', tipo.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.tipoCambio === tipo.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{tipo.label}</span>
                  <p className="text-sm text-gray-500 mt-1">{tipo.descripcion}</p>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vigencia del Cambio
              </label>
              <input
                type="date"
                value={formData.fechaVigencia}
                onChange={(e) => updateForm('fechaVigencia', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Campos específicos según tipo */}
            {formData.tipoCambio === 'sueldo' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Detalle del cambio de sueldo</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sueldo Anterior (CLP)
                    </label>
                    <input
                      type="text"
                      value={formData.sueldoAnterior}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        updateForm('sueldoAnterior', value);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="500000"
                    />
                    {formData.sueldoAnterior && (
                      <p className="text-sm text-gray-500 mt-1">
                        ${formatCurrency(formData.sueldoAnterior)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sueldo Nuevo (CLP)
                    </label>
                    <input
                      type="text"
                      value={formData.sueldoNuevo}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        updateForm('sueldoNuevo', value);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="600000"
                    />
                    {formData.sueldoNuevo && (
                      <p className="text-sm text-gray-500 mt-1">
                        ${formatCurrency(formData.sueldoNuevo)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {formData.tipoCambio === 'funciones' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Detalle del cambio de funciones</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funciones Anteriores
                  </label>
                  <textarea
                    value={formData.funcionesAnteriores}
                    onChange={(e) => updateForm('funcionesAnteriores', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Describe las funciones actuales"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nuevas Funciones
                  </label>
                  <textarea
                    value={formData.funcionesNuevas}
                    onChange={(e) => updateForm('funcionesNuevas', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Describe las nuevas funciones"
                  />
                </div>
              </div>
            )}

            {formData.tipoCambio === 'jornada' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Detalle del cambio de jornada</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horas Semanales Anteriores
                    </label>
                    <input
                      type="number"
                      value={formData.jornadaAnterior}
                      onChange={(e) => updateForm('jornadaAnterior', e.target.value)}
                      min="1"
                      max="45"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nuevas Horas Semanales
                    </label>
                    <input
                      type="number"
                      value={formData.jornadaNueva}
                      onChange={(e) => updateForm('jornadaNueva', e.target.value)}
                      min="1"
                      max="45"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.tipoCambio === 'lugar' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Detalle del cambio de lugar</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lugar de Trabajo Anterior
                  </label>
                  <input
                    type="text"
                    value={formData.lugarAnterior}
                    onChange={(e) => updateForm('lugarAnterior', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Dirección anterior"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nuevo Lugar de Trabajo
                  </label>
                  <input
                    type="text"
                    value={formData.lugarNuevo}
                    onChange={(e) => updateForm('lugarNuevo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nueva dirección"
                  />
                </div>
              </div>
            )}

            {formData.tipoCambio === 'otras' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Detalle de otra modificación</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción de la cláusula a modificar
                  </label>
                  <input
                    type="text"
                    value={formData.otraClausulaDescripcion}
                    onChange={(e) => updateForm('otraClausulaDescripcion', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ej: Beneficios, bonos, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condición Anterior
                  </label>
                  <textarea
                    value={formData.otraClausulaAnterior}
                    onChange={(e) => updateForm('otraClausulaAnterior', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Describe la condición actual"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Condición
                  </label>
                  <textarea
                    value={formData.otraClausulaNueva}
                    onChange={(e) => updateForm('otraClausulaNueva', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Describe la nueva condición"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && !showPayment && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vista Previa del Anexo
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {generatePreview()}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Aviso:</strong> Revisa cuidadosamente todos los datos
                antes de generar el documento.
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
                Pagar $2.990 con Webpay (Demo)
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

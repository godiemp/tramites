'use client';

import { useState } from 'react';
import Link from 'next/link';

type Modalidad = 'indefinido' | 'plazo-fijo';

interface FormData {
  // Empresa
  nombreEmpresa: string;
  rutEmpresa: string;
  representanteLegal: string;
  rutRepresentante: string;
  direccionEmpresa: string;
  comunaEmpresa: string;

  // Trabajador
  nombreTrabajador: string;
  rutTrabajador: string;
  nacionalidad: string;
  estadoCivil: string;
  direccionTrabajador: string;
  comunaTrabajador: string;

  // Contrato
  modalidad: Modalidad;
  cargo: string;
  funciones: string;
  sueldoBruto: string;
  jornada: string;
  horasSemanales: string;
  lugarTrabajo: string;
  fechaInicio: string;
  duracionMeses: string; // Solo para plazo fijo
}

const initialFormData: FormData = {
  nombreEmpresa: '',
  rutEmpresa: '',
  representanteLegal: '',
  rutRepresentante: '',
  direccionEmpresa: '',
  comunaEmpresa: '',
  nombreTrabajador: '',
  rutTrabajador: '',
  nacionalidad: 'Chilena',
  estadoCivil: 'Soltero/a',
  direccionTrabajador: '',
  comunaTrabajador: '',
  modalidad: 'indefinido',
  cargo: '',
  funciones: '',
  sueldoBruto: '',
  jornada: 'completa',
  horasSemanales: '45',
  lugarTrabajo: '',
  fechaInicio: '',
  duracionMeses: '3',
};

export default function ContratoLaboralPage() {
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

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handlePayment = () => {
    setShowPayment(true);
    // Simulate payment
    setTimeout(() => {
      setPaymentComplete(true);
    }, 1500);
  };

  const formatCurrency = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const generatePreview = () => {
    const fecha = new Date(formData.fechaInicio).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return `
CONTRATO DE TRABAJO
${formData.modalidad === 'indefinido' ? '(Contrato Indefinido)' : `(Contrato a Plazo Fijo por ${formData.duracionMeses} meses)`}

En ${formData.comunaEmpresa}, a ${fecha}, entre:

EMPLEADOR:
${formData.nombreEmpresa}, RUT ${formData.rutEmpresa}, representada legalmente por ${formData.representanteLegal}, RUT ${formData.rutRepresentante}, con domicilio en ${formData.direccionEmpresa}, comuna de ${formData.comunaEmpresa}, en adelante "el Empleador".

TRABAJADOR:
${formData.nombreTrabajador}, RUT ${formData.rutTrabajador}, nacionalidad ${formData.nacionalidad}, estado civil ${formData.estadoCivil}, con domicilio en ${formData.direccionTrabajador}, comuna de ${formData.comunaTrabajador}, en adelante "el Trabajador".

Se ha convenido el siguiente contrato de trabajo:

PRIMERO: NATURALEZA DE LOS SERVICIOS
El trabajador se compromete a desempeñar el cargo de ${formData.cargo}, realizando las siguientes funciones: ${formData.funciones}.

SEGUNDO: LUGAR DE TRABAJO
El trabajador prestará sus servicios en ${formData.lugarTrabajo}.

TERCERO: JORNADA DE TRABAJO
La jornada de trabajo será de ${formData.horasSemanales} horas semanales, distribuidas de lunes a viernes, en horario que el empleador determine según las necesidades del servicio.

CUARTO: REMUNERACIÓN
El empleador pagará al trabajador una remuneración mensual bruta de $${formatCurrency(formData.sueldoBruto)} (${formData.sueldoBruto} pesos), que será pagada por períodos vencidos el último día hábil de cada mes.

QUINTO: DURACIÓN DEL CONTRATO
${formData.modalidad === 'indefinido'
  ? 'El presente contrato tendrá duración indefinida.'
  : `El presente contrato tendrá una duración de ${formData.duracionMeses} meses, contados desde el ${fecha}.`}

SEXTO: FECHA DE INICIO
El trabajador iniciará sus funciones el día ${fecha}.

SÉPTIMO: OTROS BENEFICIOS
El empleador se obliga a otorgar al trabajador los beneficios legales que correspondan: gratificación legal, vacaciones, feriado legal, entre otros.

Se extiende el presente contrato en dos ejemplares, quedando uno en poder de cada parte.


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
            Tu contrato laboral está listo. En una aplicación real, aquí
            podrías descargarlo en formato PDF o Word.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
              {generatePreview()}
            </pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Descargar PDF (Demo)
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
          Contrato Laboral
        </h1>
        <p className="text-gray-600">
          Genera un contrato de trabajo válido en Chile. Completa los datos y
          obtén tu documento listo para firmar.
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
              {s === 1 && 'Datos de las partes'}
              {s === 2 && 'Detalles del contrato'}
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

      {/* Form Steps */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-8">
            {/* Datos Empresa */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Datos del Empleador
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre o Razón Social de la Empresa
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
                    placeholder="Ej: 76.123.456-7"
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
                    placeholder="Ej: 12.345.678-9"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.direccionEmpresa}
                    onChange={(e) => updateForm('direccionEmpresa', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Calle y número"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comuna
                  </label>
                  <input
                    type="text"
                    value={formData.comunaEmpresa}
                    onChange={(e) => updateForm('comunaEmpresa', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ej: Santiago"
                  />
                </div>
              </div>
            </div>

            {/* Datos Trabajador */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Datos del Trabajador
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
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
                    RUT Trabajador
                  </label>
                  <input
                    type="text"
                    value={formData.rutTrabajador}
                    onChange={(e) => handleRutChange('rutTrabajador', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ej: 12.345.678-9"
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
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccionTrabajador}
                    onChange={(e) => updateForm('direccionTrabajador', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Calle y número"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comuna
                  </label>
                  <input
                    type="text"
                    value={formData.comunaTrabajador}
                    onChange={(e) => updateForm('comunaTrabajador', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ej: Providencia"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles del Contrato
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad del Contrato
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateForm('modalidad', 'indefinido')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.modalidad === 'indefinido'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">Indefinido</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Sin fecha de término definida
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => updateForm('modalidad', 'plazo-fijo')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.modalidad === 'plazo-fijo'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">Plazo Fijo</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Con duración determinada
                  </p>
                </button>
              </div>
            </div>

            {formData.modalidad === 'plazo-fijo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración del contrato (meses)
                </label>
                <select
                  value={formData.duracionMeses}
                  onChange={(e) => updateForm('duracionMeses', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 9, 12].map((m) => (
                    <option key={m} value={m}>
                      {m} {m === 1 ? 'mes' : 'meses'}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Recuerda que los contratos a plazo fijo tienen un máximo de 12
                  meses (24 para gerentes o profesionales con título).
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => updateForm('cargo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: Vendedor, Asistente administrativo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sueldo Bruto Mensual (CLP)
                </label>
                <input
                  type="text"
                  value={formData.sueldoBruto}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    updateForm('sueldoBruto', value);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: 500000"
                />
                {formData.sueldoBruto && (
                  <p className="text-sm text-gray-500 mt-1">
                    ${formatCurrency(formData.sueldoBruto)} CLP
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funciones principales
              </label>
              <textarea
                value={formData.funciones}
                onChange={(e) => updateForm('funciones', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Describe las tareas principales del cargo"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Jornada
                </label>
                <select
                  value={formData.jornada}
                  onChange={(e) => updateForm('jornada', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="completa">Jornada Completa</option>
                  <option value="parcial">Jornada Parcial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Semanales
                </label>
                <input
                  type="number"
                  value={formData.horasSemanales}
                  onChange={(e) => updateForm('horasSemanales', e.target.value)}
                  min="1"
                  max="45"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Máximo legal: 45 horas semanales
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lugar de Trabajo
                </label>
                <input
                  type="text"
                  value={formData.lugarTrabajo}
                  onChange={(e) => updateForm('lugarTrabajo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Dirección donde trabajará"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => updateForm('fechaInicio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && !showPayment && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vista Previa del Contrato
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {generatePreview()}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Aviso:</strong> Revisa cuidadosamente todos los datos
                antes de generar el documento. Este es un ejemplo de vista
                previa que en producción se convertiría a PDF o Word.
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
                Pagar $3.990 con Webpay (Demo)
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 1,
    name: 'Plan Básico',
    price: 120,
    period: 'M',
    description: 'Perfecto para pequeñas academias o centros educativos',
    features: [
      'Hasta 1000 alumnos',
      'Gestión académica básica',
      'Gestión de matrículas',
      'Comunicación con padres',
    ],
  },
  {
    id: 2,
    name: 'Plan Profesional',
    price: 220,
    period: 'M',
    description: 'Ideal para colegios medianos con necesidades avanzadas',
    features: [
      'Hasta 5000 alumnos',
      'Gestión académica completa',
      'Sistema de pagos integrado',
      'Reportes avanzados',
      'Soporte prioritario 24/7',
    ],
  },
  {
    id: 3,
    name: 'Plan Premium',
    price: 390,
    period: 'M',
    description: 'Para grandes instituciones con requerimientos complejos',
    features: [
      'Alumnos ilimitados',
      'Personalización avanzada',
      'API completa',
      'Soporte 24/7 dedicado',
    ],
  },
];

export default function RegisterSchoolPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del colegio
    legal_name: '',
    code: '',
    official_email: '',
    official_phone: '',
    address: '',
    schema_name: '',

    // Datos del administrador inicial
    admin_name: '',
    admin_email: '',
    admin_password: '',
    admin_password_confirm: '',

    // Plan seleccionado
    plan_id: '',
    subscription_period: 'M', // Mensual por defecto
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Planes disponibles (deberías obtenerlos de tu API)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.legal_name.trim()) newErrors.legal_name = 'El nombre del colegio es requerido';
    if (!formData.code.trim()) newErrors.code = 'El código del colegio es requerido';
    if (!formData.official_email.trim()) newErrors.official_email = 'El email oficial es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.official_email))
      newErrors.official_email = 'Email inválido';

    if (!formData.schema_name.trim()) newErrors.schema_name = 'El identificador único es requerido';
    else if (!/^[a-z0-9-]+$/.test(formData.schema_name))
      newErrors.schema_name = 'Solo letras minúsculas, números y guiones medios ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.admin_name.trim())
      newErrors.admin_name = 'El nombre del administrador es requerido';
    if (!formData.admin_email.trim())
      newErrors.admin_email = 'El email del administrador es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.admin_email)) newErrors.admin_email = 'Email inválido';

    if (!formData.admin_password) newErrors.admin_password = 'La contraseña es requerida';
    else if (formData.admin_password.length < 8) newErrors.admin_password = 'Mínimo 8 caracteres';

    if (formData.admin_password !== formData.admin_password_confirm) {
      newErrors.admin_password_confirm = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // try {
    //   const response = await fetch('/api/tenants', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     // Éxito - redirigir a página de confirmación
    //     navigate('/registration-success', {
    //       state: {
    //         schoolName: formData.legal_name,
    //         adminEmail: formData.admin_email,
    //       },
    //     });
    //   } else {
    //     // Mostrar errores del servidor
    //     setErrors(data.errors || { general: 'Error en el registro. Intente nuevamente.' });
    //   }
    // } catch (error) {
    //   console.error(error?.msg);
    //   setErrors({ general: 'Error de conexión. Intente nuevamente.' });
    // } finally {
    //   setLoading(false);
    // }
    navigate('/panel-admin');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-indigo-800'>Registro de Nueva Institución</h1>
          <p className='text-gray-600'>
            Complete la información para crear su cuenta institucional
          </p>
        </div>

        {/* Progress Bar */}
        <div className='mb-8'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-medium text-indigo-600'>Paso {currentStep} de 3</span>
            <span className='text-sm text-gray-500'>
              {currentStep === 1 && 'Información del Colegio'}
              {currentStep === 2 && 'Administrador Principal'}
              {currentStep === 3 && 'Selección de Plan'}
            </span>
          </div>
          <div className='h-2 w-full rounded-full bg-gray-200'>
            <div
              className='h-2 rounded-full bg-indigo-600 transition-all duration-300'
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <div className='rounded-xl bg-white p-6 shadow-lg'>
          {errors.general && (
            <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700'>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: School Information */}
            {currentStep === 1 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Información del Colegio</h2>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Nombre Legal del Colegio *
                    </label>
                    <input
                      type='text'
                      name='legal_name'
                      value={formData.legal_name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.legal_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Ej: Colegio Santa María'
                    />
                    {errors.legal_name && (
                      <p className='mt-1 text-sm text-red-500'>{errors.legal_name}</p>
                    )}
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Código Único *
                    </label>
                    <input
                      type='text'
                      name='code'
                      value={formData.code}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.code ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Ej: CSM2024'
                    />
                    {errors.code && <p className='mt-1 text-sm text-red-500'>{errors.code}</p>}
                  </div>
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Email Oficial *
                  </label>
                  <input
                    type='email'
                    name='official_email'
                    value={formData.official_email}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                      errors.official_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='ejemplo@colegio.edu.bo'
                  />
                  {errors.official_email && (
                    <p className='mt-1 text-sm text-red-500'>{errors.official_email}</p>
                  )}
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Identificador Único *
                  </label>
                  <div className='flex items-center'>
                    <span className='rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 px-3 py-2'>
                      https://
                    </span>
                    <input
                      type='text'
                      name='schema_name'
                      value={formData.schema_name}
                      onChange={handleInputChange}
                      className={`flex-1 rounded-r-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.schema_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='colegio-santa-maria'
                    />
                    <span className='ml-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-500'>
                      .misistema.edu.bo
                    </span>
                  </div>
                  {errors.schema_name && (
                    <p className='mt-1 text-sm text-red-500'>{errors.schema_name}</p>
                  )}
                  <p className='mt-1 text-sm text-gray-500'>
                    Solo letras minúsculas, números y guiones. Este será su subdominio único.
                  </p>
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Dirección</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                    placeholder='Av. Principal #123, Ciudad'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Teléfono Oficial
                  </label>
                  <input
                    type='tel'
                    name='official_phone'
                    value={formData.official_phone}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                    placeholder='+591 71234567'
                  />
                </div>
              </div>
            )}

            {/* Step 2: Admin Information */}
            {currentStep === 2 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Administrador Principal</h2>
                <p className='text-gray-600'>
                  Esta persona tendrá acceso completo al sistema como administrador inicial.
                </p>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Nombre Completo *
                    </label>
                    <input
                      type='text'
                      name='admin_name'
                      value={formData.admin_name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.admin_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Juan Pérez'
                    />
                    {errors.admin_name && (
                      <p className='mt-1 text-sm text-red-500'>{errors.admin_name}</p>
                    )}
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>Email *</label>
                    <input
                      type='email'
                      name='admin_email'
                      value={formData.admin_email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.admin_email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='admin@colegio.edu.bo'
                    />
                    {errors.admin_email && (
                      <p className='mt-1 text-sm text-red-500'>{errors.admin_email}</p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Contraseña *
                    </label>
                    <input
                      type='password'
                      name='admin_password'
                      value={formData.admin_password}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.admin_password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Mínimo 8 caracteres'
                    />
                    {errors.admin_password && (
                      <p className='mt-1 text-sm text-red-500'>{errors.admin_password}</p>
                    )}
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Confirmar Contraseña *
                    </label>
                    <input
                      type='password'
                      name='admin_password_confirm'
                      value={formData.admin_password_confirm}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.admin_password_confirm ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Repita su contraseña'
                    />
                    {errors.admin_password_confirm && (
                      <p className='mt-1 text-sm text-red-500'>{errors.admin_password_confirm}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Seleccione su Plan</h2>
                <p className='text-gray-600'>
                  Elija el plan que mejor se adapte a las necesidades de su institución.
                </p>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all ${
                        formData.plan_id === plan.id
                          ? 'border-indigo-500 ring-2 ring-indigo-500'
                          : 'border-gray-300 hover:border-indigo-300'
                      }`}
                      onClick={() => setFormData({ ...formData, plan_id: plan.id })}
                    >
                      <h3 className='text-lg font-semibold text-indigo-700'>{plan.name}</h3>
                      <p className='my-2 text-2xl font-bold'>Bs{plan.price}/mes</p>
                      <p className='mb-3 text-sm text-gray-600'>{plan.description}</p>
                      <ul className='space-y-1 text-sm'>
                        {plan.features.map((feature, index) => (
                          <li key={index} className='flex items-center'>
                            <svg
                              className='mr-2 h-4 w-4 text-green-500'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {formData.plan_id && (
                  <div className='rounded-lg bg-indigo-50 p-4'>
                    <h4 className='mb-2 font-semibold text-indigo-800'>Resumen de su selección:</h4>
                    <p>Plan: {plans.find((p) => p.id === parseInt(formData.plan_id))?.name}</p>
                    <p>
                      Precio: Bs{plans.find((p) => p.id === parseInt(formData.plan_id))?.price}{' '}
                      mensuales
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className='mt-8 flex justify-between'>
              {currentStep > 1 ? (
                <button
                  type='button'
                  onClick={handlePreviousStep}
                  className='rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-50'
                >
                  Anterior
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type='button'
                  onClick={handleNextStep}
                  className='rounded-lg bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700'
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type='submit'
                  disabled={loading || !formData.plan_id}
                  className='rounded-lg bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {loading ? 'Procesando...' : 'Completar Registro'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className='mt-6 text-center text-sm text-gray-500'>
          <p>
            ¿Necesita ayuda?{' '}
            <a href='/contact' className='text-indigo-600 hover:underline'>
              Contáctenos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

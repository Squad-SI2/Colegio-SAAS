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
    schema_name: 'colegio_101',
    legal_name: 'Colegio Santa Fe',
    code: 'SF-2025',
    official_email: 'infor@santafe.edu.bo',
    official_phone: '70000000',
    address: 'Calle 1 #123',
    is_active: true,
    plan: '1',
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.legal_name.trim()) newErrors.legal_name = 'El nombre del colegio es requerido';
    if (!formData.code.trim()) newErrors.code = 'El código del colegio es requerido';

    if (!formData.official_email.trim()) newErrors.official_email = 'El email oficial es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.official_email))
      newErrors.official_email = 'Email inválido';

    if (!formData.schema_name.trim()) newErrors.schema_name = 'El identificador único es requerido';
    else if (!/^[a-z0-9-_]+$/.test(formData.schema_name))
      newErrors.schema_name = 'Solo letras minúsculas, números';

    if (!formData.plan) newErrors.plan = 'Debe seleccionar un plan';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let token = localStorage.getItem('accessToken');
      const response = await fetch('api/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          plan: parseInt(formData.plan),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = localStorage.getItem('accessToken');
        const response2 = await fetch('api/domains', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            domain: `${data.schema_name}.localhost`,

            tenant: data.id,
            is_primary: true,
          }),
        });
        const data2 = await response2.json();
        if (response2.ok) {
          console.log(data2);
          navigate('/panel-admin');
        } else {
          setErrors(
            data.errors || { general: 'Error en el registro del dominio. Intente nuevamente.' }
          );
        }
      } else {
        setErrors(data.errors || { general: 'Error en el registro. Intente nuevamente.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
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

        {/* Form Container */}
        <div className='rounded-xl bg-white p-6 shadow-lg'>
          {errors.general && (
            <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700'>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Información del Colegio */}
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

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
            </div>

            {/* Selección de Plan */}
            <div className='mt-8 space-y-6'>
              <h2 className='text-xl font-semibold text-gray-800'>Seleccione su Plan *</h2>
              <p className='text-gray-600'>
                Elija el plan que mejor se adapte a las necesidades de su institución.
              </p>

              {errors.plan && <p className='text-sm text-red-500'>{errors.plan}</p>}

              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      formData.plan === plan.id.toString()
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300 hover:border-indigo-300'
                    }`}
                    onClick={() => setFormData({ ...formData, plan: plan.id.toString() })}
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

              {formData.plan && (
                <div className='rounded-lg bg-indigo-50 p-4'>
                  <h4 className='mb-2 font-semibold text-indigo-800'>Resumen de su selección:</h4>
                  <p>Plan: {plans.find((p) => p.id === parseInt(formData.plan))?.name}</p>
                  <p>
                    Precio: Bs{plans.find((p) => p.id === parseInt(formData.plan))?.price} mensuales
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='mt-8 flex justify-end'>
              <button
                type='submit'
                disabled={loading}
                className='rounded-lg bg-indigo-600 px-8 py-3 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {loading ? 'Procesando...' : 'Completar Registro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

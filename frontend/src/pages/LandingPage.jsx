import { SYSTEM_NAME } from '../constants/index';
import NavBar from '../components/NavBar';
import FeatureCard from '../components/FeatureCard';
import PriceCard from '../components/PriceCard';
import TestimonialCard from '../components/TestimonialCard';

function LandingPage() {
  return (
    <main className='flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100'>
      <NavBar
        routes={[
          {
            name: 'Características',
            href: '#features',
          },
          {
            name: 'Precios',
            href: '#pricing',
          },
          {
            name: 'Testimonios',
            href: '#testimonials',
          },
        ]}
      ></NavBar>
      <header className='flex flex-col items-center justify-center px-4 py-16 text-center'>
        <h1 className='mb-6 text-4xl font-extrabold text-indigo-800 md:text-6xl'>
          Transforma la Gestión de tu Institución Educativa
        </h1>
        <p className='mb-8 max-w-3xl text-lg text-gray-700 md:text-xl'>
          La plataforma todo-en-uno que simplifica la administración escolar, mejora la comunicación
          y optimiza los procesos académicos.
        </p>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <a
            href='#pricing'
            className='rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow transition hover:bg-indigo-700'
          >
            Comenzar gratis
          </a>
        </div>
        <img
          src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
          alt={`Dashboard ${SYSTEM_NAME}`}
          className='mt-12 w-full max-w-5xl rounded-xl border border-gray-200 shadow-2xl'
        />
      </header>
      {/* Features Section */}
      <section id='features' className='bg-white px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-4 text-center text-3xl font-bold text-indigo-800 md:text-4xl'>
            Todo lo que necesitas en una sola plataforma
          </h2>
          <p className='mx-auto mb-12 max-w-3xl text-center text-gray-600'>
            Diseñado específicamente para instituciones educativas, con herramientas que facilitan
            el día a día.
          </p>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <FeatureCard
              icon={
                <svg
                  className='h-6 w-6 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                  ></path>
                </svg>
              }
              title='Gestión Estudiantil'
              description='Administra matrículas, historiales académicos, asistencia y toda la información de tus estudiantes.'
            ></FeatureCard>

            <FeatureCard
              icon={
                <svg
                  className='h-6 w-6 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  ></path>
                </svg>
              }
              title='Calificaciones y Evaluaciones'
              description='Registra y analiza el rendimiento académico con reportes detallados y personalizables.'
            ></FeatureCard>

            <FeatureCard
              icon={
                <svg
                  className='h-6 w-6 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  ></path>
                </svg>
              }
              title='Gestión Financiera'
              description='Controla pagos, facturación y estados de cuenta con procesos automatizados y seguros.'
            ></FeatureCard>
          </div>
        </div>
      </section>
      <section id='pricing' className='bg-indigo-25 px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-4 text-center text-3xl font-bold text-indigo-800 md:text-4xl'>
            Planes a medida para tu institución
          </h2>
          <p className='mx-auto mb-12 max-w-3xl text-center text-gray-600'>
            Elige el plan que mejor se adapte a las necesidades de tu colegio. Todos incluyen
            actualizaciones gratuitas y soporte técnico.
          </p>

          <div className='flex flex-col justify-center gap-8 md:flex-row'>
            <PriceCard
              plan='Básico'
              price={120}
              description='Perfecto para pequeñas academias o centros educativos'
              features={[
                'Hasta 1000 alumnos',
                'Gestión académica básica',
                'Gestión de matriculas',
                'Comunicación con padres',
              ]}
              isPopular={false}
            />
            <PriceCard
              plan='Profesional'
              price={220}
              description='Ideal para colegios medianos con necesidades avanzadas'
              features={[
                'Hasta 5000 alumnos',
                'Gestión académica completa',
                'Sistema de pagos integrado',
                'Reportes avanzados',
                'Soporte prioritario 24/7',
              ]}
              isPopular={true}
            />
            <PriceCard
              plan='Premium'
              price={390}
              description='Para grandes instituciones con requerimientos complejos'
              features={[
                'Alumnos ilimitados',
                'Personalización avanzada',
                'API completa',
                'Soporte 24/7 dedicado',
              ]}
              isPopular={false}
            />
          </div>

          <p className='mt-8 text-center text-gray-500'>
            ¿Necesitas un plan personalizado?{' '}
            <a href='#contact' className='text-indigo-600 hover:underline'>
              Contáctanos
            </a>
          </p>
        </div>
      </section>
      <section id='testimonials' className='bg-white px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-12 text-center text-3xl font-bold text-indigo-800 md:text-4xl'>
            Lo que dicen nuestros clientes
          </h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <TestimonialCard
              name='Carlos Méndez'
              role='Director, Colegio Santa María'
              testimonial={`Desde que implementamos ${SYSTEM_NAME}, hemos reducido un 40% el tiempo dedicado a tareas administrativas. La comunicación con los padres es ahora mucho más efectiva.`}
            ></TestimonialCard>

            <TestimonialCard
              name='Laura Rodríguez'
              role='Coordinadora, Instituto Moderno'
              testimonial='El módulo de calificaciones nos ha permitido generar reportes detallados en minutos en lugar de horas. Los profesores están encantados con la facilidad de uso.'
            ></TestimonialCard>

            <TestimonialCard
              name='José González'
              role='Administrador, Academia Brillante'
              testimonial='El módulo de pagos se ha simplificado enormemente. Los recordatorios automáticos y la posibilidad de pagos en línea han reducido la morosidad en un 60%.'
            ></TestimonialCard>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className='bg-indigo-600 px-4 py-16 text-white'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mb-6 text-3xl font-bold md:text-4xl'>
            ¿Listo para transformar la gestión de tu institución?
          </h2>
          <p className='mb-8 text-lg'>
            Únete a cientos de instituciones educativas que ya usan {SYSTEM_NAME} para simplificar
            sus procesos.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <a
              href='#pricing'
              className='rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 shadow transition hover:bg-indigo-50'
            >
              Comenzar ahora
            </a>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className='bg-indigo-800 px-4 py-12 text-white'>
        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4'>
          <div>
            <div className='mb-4 flex items-center'>
              <img src='/logo.png' alt={`${SYSTEM_NAME} logo`} className='mr-2 h-8 w-auto' />
              <span className='text-xl font-bold'>{SYSTEM_NAME}</span>
            </div>
            <p className='text-indigo-200'>
              La plataforma integral para la gestión educativa del siglo XXI.
            </p>
          </div>

          <div>
            <h4 className='mb-4 font-semibold'>Producto</h4>
            <ul className='space-y-2'>
              <li>
                <a href='#features' className='text-indigo-200 transition hover:text-white'>
                  Características
                </a>
              </li>
              <li>
                <a href='#pricing' className='text-indigo-200 transition hover:text-white'>
                  Precios
                </a>
              </li>
              <li>
                <a href='#testimonials' className='text-indigo-200 transition hover:text-white'>
                  Casos de éxito
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mx-auto mt-8 max-w-6xl border-t border-indigo-700 pt-8 text-center text-indigo-200'>
          <p>
            &copy; {new Date().getFullYear()} {SYSTEM_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;

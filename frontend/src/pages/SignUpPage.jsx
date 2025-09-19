import { SYSTEM_NAME } from '../constants/index';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password, role: 'EST' }),
      });

      if (response.ok) {
        navigate('/panel-admin');
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'No se pudo registrar'));
      }
    } catch (error) {
      console.error('Error en SignUp:', error);
    }
    // navigate('/panel-admin');
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg'>
        <div>
          <img className='mx-auto h-12 w-auto' src='/logo.png' alt={SYSTEM_NAME} />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Registrarse</h2>
          <p className='mt-2 text-center text-sm text-gray-600'>Crea una cuenta de {SYSTEM_NAME}</p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <input type='hidden' name='remember' value='true' />
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='username' className='sr-only'>
                Usuario
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                required
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
                placeholder='Usuario'
              />
            </div>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Correo electrónico
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
                placeholder='Correo electrónico'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Contraseña
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
                placeholder='Contraseña'
              />
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                Recordarme
              </label>
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;

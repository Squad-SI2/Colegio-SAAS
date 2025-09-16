import { useState } from 'react';
import Sidebar from '../components/SideBar';
import { SYSTEM_NAME } from '../constants/index';

export default function PanelAdmin() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'students':
        return <StudentsContent />;
      case 'teachers':
        return <TeachersContent />;
      case 'courses':
        return <CoursesContent />;
      case 'grades':
        return <GradesContent />;
      case 'reports':
        return <ReportsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <header className='bg-white shadow-sm'>
          <div className='flex items-center justify-between px-6 py-4'>
            <h1 className='text-2xl font-semibold text-gray-900'>
              Panel de Administración - {SYSTEM_NAME}
            </h1>
            <div className='flex items-center'>
              <span className='mr-4 text-gray-700'>Bienvenido, Admin</span>
              <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700'>
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className='flex-1 overflow-y-auto p-6'>{renderContent()}</main>
      </div>
    </div>
  );
}

// Componentes de contenido para cada sección
function DashboardContent() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Resumen General</h2>
      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-2 text-lg font-medium text-gray-900'>Total de Estudiantes</h3>
          <p className='text-3xl font-bold text-indigo-600'>1,245</p>
        </div>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-2 text-lg font-medium text-gray-900'>Total de Profesores</h3>
          <p className='text-3xl font-bold text-indigo-600'>45</p>
        </div>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-2 text-lg font-medium text-gray-900'>Cursos Activos</h3>
          <p className='text-3xl font-bold text-indigo-600'>32</p>
        </div>
      </div>
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 text-lg font-medium text-gray-900'>Actividad Reciente</h3>
        <p>No hay actividad reciente para mostrar.</p>
      </div>
    </div>
  );
}

function StudentsContent() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Gestión de Estudiantes</h2>
      <div className='rounded-lg bg-white p-6 shadow'>
        <p>Contenido de gestión de estudiantes...</p>
      </div>
    </div>
  );
}

function TeachersContent() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Gestión de Profesores</h2>
      <div className='rounded-lg bg-white p-6 shadow'>
        <p>Contenido de gestión de profesores...</p>
      </div>
    </div>
  );
}

function CoursesContent() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Gestión de Cursos</h2>
      <div className='rounded-lg bg-white p-6 shadow'>
        <p>Contenido de gestión de cursos...</p>
      </div>
    </div>
  );
}

function GradesContent() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Gestión de Calificaciones</h2>
      <div className='rounded-lg bg-white p-6 shadow'>
        <p>Contenido de gestión de calificaciones...</p>
      </div>
    </div>
  );
}

function ReportsContent() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Reportes y Estadísticas</h2>
      <div className='rounded-lg bg-white p-6 shadow'>
        <p>Contenido de reportes y estadísticas...</p>
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Configuración del Sistema</h2>
      <div className='rounded-lg bg-white p-6 shadow'>
        <p>Contenido de configuración del sistema...</p>
      </div>
    </div>
  );
}

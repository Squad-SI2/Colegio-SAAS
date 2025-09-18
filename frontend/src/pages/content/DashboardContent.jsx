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
export default DashboardContent;

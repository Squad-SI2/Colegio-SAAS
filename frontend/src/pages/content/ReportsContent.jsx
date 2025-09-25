import { useState } from 'react';

export default function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState('');

  const reportOptions = [
    { value: 'enrollments', label: 'Reporte de Matrículas por Período' },
    { value: 'students', label: 'Listado de Estudiantes por Grado' },
    { value: 'grades', label: 'Distribución de Estudiantes por Grado' },
    { value: 'sections', label: 'Cupos por Sección' },
  ];

  const handleGenerateReport = () => {
    if (selectedReport) {
      // Lógica para generar reporte
      alert(`Generando reporte: ${selectedReport}`);
    }
  };

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-semibold'>Reportes</h2>
        <p className='text-gray-600'>Genere reportes del sistema académico</p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-lg font-medium'>Reportes Disponibles</h3>

          <div className='mb-4'>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Seleccione un reporte:
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className='w-full rounded-lg border border-gray-300 p-2'
            >
              <option value=''>-- Seleccione --</option>
              {reportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={!selectedReport}
            className={`rounded-lg px-4 py-2 text-white ${
              selectedReport
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'cursor-not-allowed bg-gray-400'
            }`}
          >
            Generar Reporte
          </button>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-lg font-medium'>Estadísticas Rápidas</h3>
          <div className='space-y-3'>
            <div className='flex justify-between border-b pb-2'>
              <span>Total Estudiantes Activos:</span>
              <span className='font-semibold'>150</span>
            </div>
            <div className='flex justify-between border-b pb-2'>
              <span>Matrículas Este Período:</span>
              <span className='font-semibold'>145</span>
            </div>
            <div className='flex justify-between border-b pb-2'>
              <span>Grados Activos:</span>
              <span className='font-semibold'>12</span>
            </div>
            <div className='flex justify-between border-b pb-2'>
              <span>Secciones Activas:</span>
              <span className='font-semibold'>24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

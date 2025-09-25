import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function EnrollmentsContent() {
  const [enrollments, setEnrollments] = useState([]);

  const columns = [
    { key: 'student.code', title: 'Código Est.' },
    {
      key: 'student',
      title: 'Estudiante',
      render: (item) => `${item.student?.person?.first_name} ${item.student?.person?.last_name}`,
    },
    { key: 'period.name', title: 'Período' },
    { key: 'grade.name', title: 'Grado' },
    { key: 'section.name', title: 'Sección' },
    {
      key: 'status',
      title: 'Estado Matrícula',
      render: (item) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            item.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : item.status === 'WITHDRAWN'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  // Datos de ejemplo
  const mockEnrollments = [
    {
      id: 1,
      student: {
        code: 'EST2024001',
        person: { first_name: 'María', last_name: 'García' },
      },
      period: { name: '2024 - Año Escolar' },
      grade: { name: 'Primero' },
      section: { name: 'A' },
      status: 'ACTIVE',
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Gestión de Matrículas</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>+ Nueva Matrícula</button>
      </div>
      <DataTable columns={columns} data={mockEnrollments} />
    </div>
  );
}

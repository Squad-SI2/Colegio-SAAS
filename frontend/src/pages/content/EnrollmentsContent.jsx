import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function EnrollmentsContent() {
  const [enrollments, setEnrollments] = useState([]);

  const columns = [
    { key: 'student_code', title: 'Código Est.' },
    { key: 'student_name', title: 'Estudiante' },
    { key: 'period_name', title: 'Período' },
    { key: 'grade_name', title: 'Grado' },
    { key: 'section_name', title: 'Sección' },
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
          {item.status === 'ACTIVE'
            ? 'Activa'
            : item.status === 'WITHDRAWN'
              ? 'Retirado'
              : item.status === 'TRANSFERRED'
                ? 'Transferido'
                : 'Finalizada'}
        </span>
      ),
    },
    { key: 'enroll_date', title: 'Fecha Matrícula' },
  ];

  // Datos de ejemplo
  const mockEnrollments = [
    {
      id: 1,
      student: 1,
      student_code: 'EST001',
      student_name: 'Pérez, Juan',
      period: 1,
      period_name: '2024 - Año Escolar',
      grade: 1,
      grade_name: 'Primero',
      section: 1,
      section_name: 'A',
      status: 'ACTIVE',
      enroll_date: '2024-02-01',
    },
    {
      id: 2,
      student: 2,
      student_code: 'EST002',
      student_name: 'Gómez, María',
      period: 1,
      period_name: '2024 - Año Escolar',
      grade: 1,
      grade_name: 'Primero',
      section: 1,
      section_name: 'A',
      status: 'ACTIVE',
      enroll_date: '2024-02-01',
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Matrículas</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>+ Nueva Matrícula</button>
      </div>
      <DataTable columns={columns} data={mockEnrollments} />
    </div>
  );
}

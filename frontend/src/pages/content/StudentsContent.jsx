import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function StudentsContent() {
  const [students, setStudents] = useState([]);

  const columns = [
    { key: 'code', title: 'Código' },
    {
      key: 'person',
      title: 'Estudiante',
      render: (item) => `${item.person?.first_name} ${item.person?.last_name}`,
    },
    { key: 'person.email', title: 'Email' },
    { key: 'admission_date', title: 'Fecha Ingreso' },
    {
      key: 'is_active',
      title: 'Estado',
      render: (item) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {item.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  // Datos de ejemplo
  const mockStudents = [
    {
      id: 1,
      code: 'EST2024001',
      person: { first_name: 'María', last_name: 'García', email: 'maria@colegio.edu' },
      admission_date: '2024-01-15',
      is_active: true,
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Gestión de Estudiantes</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>
          + Nuevo Estudiante
        </button>
      </div>
      <DataTable columns={columns} data={mockStudents} />
    </div>
  );
}

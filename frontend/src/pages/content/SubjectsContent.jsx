import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function SubjectsContent() {
  const [subjects, setSubjects] = useState([]);

  const columns = [
    { key: 'level_name', title: 'Nivel Educativo' },
    { key: 'name', title: 'Asignatura' },
    { key: 'short_name', title: 'Abreviatura' },
    {
      key: 'is_active',
      title: 'Estado',
      render: (item) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {item.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  // Datos de ejemplo
  const mockSubjects = [
    {
      id: 1,
      level: 1,
      level_name: 'Primaria',
      name: 'Matemáticas',
      short_name: 'MAT',
      is_active: true,
    },
    {
      id: 2,
      level: 1,
      level_name: 'Primaria',
      name: 'Lengua y Literatura',
      short_name: 'LL',
      is_active: true,
    },
    {
      id: 3,
      level: 2,
      level_name: 'Secundaria',
      name: 'Ciencias Naturales',
      short_name: 'CN',
      is_active: true,
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Asignaturas/Materias</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>
          + Nueva Asignatura
        </button>
      </div>
      <DataTable columns={columns} data={mockSubjects} />
    </div>
  );
}

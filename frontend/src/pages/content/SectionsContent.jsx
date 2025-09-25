import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function SectionsContent() {
  const [sections, setSections] = useState([]);

  const columns = [
    { key: 'level_name', title: 'Nivel' },
    { key: 'grade_name', title: 'Grado' },
    { key: 'name', title: 'Sección' },
    { key: 'capacity', title: 'Capacidad' },
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
  const mockSections = [
    {
      id: 1,
      grade: 1,
      level_name: 'Primaria',
      grade_name: 'Primero',
      name: 'A',
      capacity: 30,
      is_active: true,
    },
    {
      id: 2,
      grade: 1,
      level_name: 'Primaria',
      grade_name: 'Primero',
      name: 'B',
      capacity: 28,
      is_active: true,
    },
    {
      id: 3,
      grade: 2,
      level_name: 'Primaria',
      grade_name: 'Segundo',
      name: 'A',
      capacity: 32,
      is_active: true,
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Secciones/Paralelos</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>+ Nueva Sección</button>
      </div>
      <DataTable columns={columns} data={mockSections} />
    </div>
  );
}

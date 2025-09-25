import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function PeriodsContent() {
  const [periods, setPeriods] = useState([]);

  const columns = [
    { key: 'name', title: 'Nombre' },
    { key: 'start_date', title: 'Fecha Inicio' },
    { key: 'end_date', title: 'Fecha Fin' },
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

  // Datos de ejemplo (reemplazar con API call)
  const mockPeriods = [
    {
      id: 1,
      name: '2024 - Año Escolar',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      is_active: true,
    },
    {
      id: 2,
      name: '2023 - Año Escolar',
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      is_active: false,
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Períodos Académicos</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>+ Nuevo Período</button>
      </div>
      <DataTable columns={columns} data={mockPeriods} />
    </div>
  );
}

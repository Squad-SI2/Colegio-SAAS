import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function PersonsContent() {
  const [persons, setPersons] = useState([]);

  const columns = [
    { key: 'first_name', title: 'Nombres' },
    { key: 'last_name', title: 'Apellidos' },
    { key: 'doc_type', title: 'Tipo Doc.' },
    { key: 'doc_number', title: 'Número Doc.' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Teléfono' },
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
  const mockPersons = [
    {
      id: 1,
      first_name: 'Juan',
      last_name: 'Pérez',
      doc_type: 'CI',
      doc_number: '12345678',
      email: 'juan@email.com',
      phone: '099123456',
      birth_date: '2000-01-01',
      is_active: true,
    },
    {
      id: 2,
      first_name: 'María',
      last_name: 'Gómez',
      doc_type: 'CI',
      doc_number: '87654321',
      email: 'maria@email.com',
      phone: '099654321',
      birth_date: '1999-05-15',
      is_active: true,
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Personas</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>+ Nueva Persona</button>
      </div>
      <DataTable columns={columns} data={mockPersons} />
    </div>
  );
}

import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function LevelsContent() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/levels/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLevels(data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', title: 'Nombre' },
    { key: 'short_name', title: 'Nombre Corto' },
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

  if (loading) return <div>Cargando niveles...</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Niveles Educativos</h2>
        <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white'>+ Nuevo Nivel</button>
      </div>
      <DataTable columns={columns} data={levels} />
    </div>
  );
}

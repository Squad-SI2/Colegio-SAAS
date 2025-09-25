import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

export default function LevelsContent() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', short_name: '', is_active: true });
  const [editingLevel, setEditingLevel] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('api/levels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar niveles');
      const data = await response.json();
      setLevels(data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar nivel
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const url = editingLevel ? `api/levels/${editingLevel.id}` : 'api/levels';
    const method = editingLevel ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar nivel');

      await fetchLevels();
      setShowForm(false);
      setFormData({ name: '', short_name: '', is_active: true });
      setEditingLevel(null);
    } catch (error) {
      console.error('Error saving level:', error);
    }
  };

  // Eliminar nivel
  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este nivel?')) return;
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`api/levels/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setLevels((prev) => prev.filter((lvl) => lvl.id !== id));
      } else {
        throw new Error('Error al eliminar nivel');
      }
    } catch (error) {
      console.error(error);
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
    {
      key: 'actions',
      title: 'Acciones',
      render: (item) => (
        <div className='flex gap-2'>
          <button
            onClick={() => {
              setEditingLevel(item);
              setFormData(item);
              setShowForm(true);
            }}
            className='rounded bg-yellow-500 px-2 py-1 text-white'
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className='rounded bg-red-600 px-2 py-1 text-white'
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando niveles...</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Niveles Educativos</h2>
        <button
          onClick={() => {
            setFormData({ name: '', short_name: '', is_active: true });
            setEditingLevel(null);
            setShowForm(true);
          }}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white'
        >
          + Nuevo Nivel
        </button>
      </div>

      <DataTable columns={columns} data={levels} />

      {showForm && (
        <div className='mt-6 rounded-lg border p-4 shadow'>
          <h3 className='mb-4 text-lg font-semibold'>
            {editingLevel ? 'Editar Nivel' : 'Nuevo Nivel'}
          </h3>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input
              type='text'
              placeholder='Nombre'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='rounded border px-2 py-1'
              required
            />
            <input
              type='text'
              placeholder='Nombre corto'
              value={formData.short_name}
              onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
              className='rounded border px-2 py-1'
              required
            />
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Activo
            </label>
            <button type='submit' className='rounded bg-green-600 px-4 py-2 text-white'>
              {editingLevel ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type='button'
              onClick={() => setShowForm(false)}
              className='rounded bg-gray-500 px-4 py-2 text-white'
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

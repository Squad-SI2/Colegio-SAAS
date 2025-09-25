import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function LevelsContent() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    is_active: true,
  });

  const columns = [
    { key: 'name', title: 'Nombre' },
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
    {
      key: 'actions',
      title: 'Acciones',
      render: (item) => (
        <div className='flex space-x-2'>
          <button
            onClick={() => handleEdit(item)}
            className='text-indigo-600 hover:text-indigo-900'
          >
            Editar
          </button>
          <button onClick={() => handleDelete(item.id)} className='text-red-600 hover:text-red-900'>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`api/levels`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar niveles');

      const data = await response.json();
      setLevels(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingLevel ? `api/levels/${editingLevel.id}` : `api/levels`;

      const method = editingLevel ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar nivel');
      }

      await fetchLevels();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        '¿Está seguro de eliminar este nivel educativo?\n\nNota: Esta acción afectará a todos los grados y asignaturas asociados.'
      )
    )
      return;

    try {
      const response = await fetch(`api/levels/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar nivel');

      await fetchLevels();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (level) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      short_name: level.short_name,
      is_active: level.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      short_name: '',
      is_active: true,
    });
    setEditingLevel(null);
  };

  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  if (loading) return <div className='py-8 text-center'>Cargando niveles educativos...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Niveles Educativos</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
        >
          + Nuevo Nivel
        </button>
      </div>

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={levels} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingLevel ? 'Editar Nivel Educativo' : 'Nuevo Nivel Educativo'}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Nombre del Nivel *</label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Ej: Educación Primaria, Educación Secundaria, etc.'
              maxLength={80}
            />
            <p className='mt-1 text-sm text-gray-500'>
              Nombre completo del nivel educativo (máx. 80 caracteres)
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Abreviatura</label>
            <input
              type='text'
              value={formData.short_name}
              onChange={(e) =>
                setFormData({ ...formData, short_name: e.target.value.toUpperCase() })
              }
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Ej: PRIM, SEC, INIC'
              maxLength={20}
            />
            <p className='mt-1 text-sm text-gray-500'>
              Código corto para identificar el nivel (máx. 20 caracteres)
            </p>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='is_active'
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className='mr-2'
            />
            <label htmlFor='is_active' className='text-sm font-medium text-gray-700'>
              Nivel activo
            </label>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className='rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
            >
              {editingLevel ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

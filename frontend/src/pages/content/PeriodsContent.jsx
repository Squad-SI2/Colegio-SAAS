import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function PeriodsContent() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_active: false,
  });

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

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const response = await fetch(`api/periods`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar períodos');

      const data = await response.json();
      setPeriods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPeriod ? `api/periods/${editingPeriod.id}` : `api/periods`;

      const method = editingPeriod ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al guardar período');

      await fetchPeriods();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este período?')) return;

    try {
      const response = await fetch(`api/periods/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar período');

      await fetchPeriods();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setFormData({
      name: period.name,
      start_date: period.start_date,
      end_date: period.end_date,
      is_active: period.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      is_active: false,
    });
    setEditingPeriod(null);
  };

  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  if (loading) return <div className='py-8 text-center'>Cargando...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Períodos Académicos</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
        >
          + Nuevo Período
        </button>
      </div>

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={periods} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingPeriod ? 'Editar Período' : 'Nuevo Período'}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Nombre</label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Fecha Inicio</label>
            <input
              type='date'
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Fecha Fin</label>
            <input
              type='date'
              required
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            />
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
              Período activo
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
              {editingPeriod ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

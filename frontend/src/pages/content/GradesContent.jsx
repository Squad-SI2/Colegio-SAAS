import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function GradesContent() {
  const [grades, setGrades] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    level: '',
    name: '',
    order: 1,
    is_active: true,
  });

  const columns = [
    {
      key: 'level_name',
      title: 'Nivel Educativo',
      render: (item) => item.level_name || 'N/A',
    },
    { key: 'name', title: 'Grado' },
    { key: 'order', title: 'Orden' },
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
      console.error('Error loading levels:', err);
    }
  };

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await fetch(`api/grades`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar grados');

      const data = await response.json();

      // Enriquecer datos con nombre del nivel
      const gradesWithLevelName = data.map((grade) => ({
        ...grade,
        level_name: levels.find((level) => level.id === grade.level)?.name || 'N/A',
      }));

      setGrades(gradesWithLevelName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingGrade ? `api/grades/${editingGrade.id}` : `api/grades`;

      const method = editingGrade ? 'PUT' : 'POST';

      // Preparar datos para enviar (convertir level a número)
      const submitData = {
        ...formData,
        level: parseInt(formData.level),
        order: parseInt(formData.order),
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar grado');
      }

      await fetchGrades();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este grado?')) return;

    try {
      const response = await fetch(`api/grades/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar grado');

      await fetchGrades();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      level: grade.level.toString(),
      name: grade.name,
      order: grade.order,
      is_active: grade.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      level: '',
      name: '',
      order: 1,
      is_active: true,
    });
    setEditingGrade(null);
  };

  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchLevels();
      await fetchGrades();
    };
    loadData();
  }, []);

  // Volver a cargar grados cuando levels se actualice
  useEffect(() => {
    if (levels.length > 0 && grades.length === 0) {
      fetchGrades();
    }
  }, [levels]);

  if (loading) return <div className='py-8 text-center'>Cargando grados...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Grados/Cursos</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          disabled={levels.length === 0}
        >
          + Nuevo Grado
        </button>
      </div>

      {levels.length === 0 && (
        <div className='mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-700'>
          Primero debe crear niveles educativos para poder agregar grados.
        </div>
      )}

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={grades} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingGrade ? 'Editar Grado' : 'Nuevo Grado'}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Nivel Educativo *</label>
            <select
              required
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            >
              <option value=''>Seleccione un nivel</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Nombre del Grado *</label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Ej: Primero, Segundo, etc.'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Orden *</label>
            <input
              type='number'
              required
              min='1'
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            />
            <p className='mt-1 text-sm text-gray-500'>
              Número para ordenar los grados (1, 2, 3...)
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
              Grado activo
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
              {editingGrade ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function SubjectsContent() {
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    level: '',
    name: '',
    short_name: '',
    is_active: true,
  });

  const columns = [
    {
      key: 'level_name',
      title: 'Nivel Educativo',
      render: (item) => item.level_name || 'N/A',
    },
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
          {item.is_active ? 'Activa' : 'Inactiva'}
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

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`api/subjects`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar asignaturas');

      const data = await response.json();

      // Enriquecer datos con nombre del nivel
      const subjectsWithLevelName = data.map((subject) => ({
        ...subject,
        level_name: levels.find((level) => level.id === subject.level)?.name || 'N/A',
      }));

      setSubjects(subjectsWithLevelName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSubject ? `api/subjects/${editingSubject.id}` : `api/subjects`;

      const method = editingSubject ? 'PUT' : 'POST';

      // Preparar datos para enviar
      const submitData = {
        ...formData,
        level: parseInt(formData.level),
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
        throw new Error(errorData.detail || 'Error al guardar asignatura');
      }

      await fetchSubjects();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta asignatura?')) return;

    try {
      const response = await fetch(`api/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar asignatura');

      await fetchSubjects();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      level: subject.level.toString(),
      name: subject.name,
      short_name: subject.short_name,
      is_active: subject.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      level: '',
      name: '',
      short_name: '',
      is_active: true,
    });
    setEditingSubject(null);
  };

  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchLevels();
    };
    loadInitialData();
  }, []);

  // Cuando levels se cargue, cargar subjects
  useEffect(() => {
    if (levels.length > 0) {
      fetchSubjects();
    }
  }, [levels]);

  if (loading) return <div className='py-8 text-center'>Cargando asignaturas...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Asignaturas/Materias</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          disabled={levels.length === 0}
        >
          + Nueva Asignatura
        </button>
      </div>

      {levels.length === 0 && (
        <div className='mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-700'>
          Primero debe crear niveles educativos para poder agregar asignaturas.
        </div>
      )}

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={subjects} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingSubject ? 'Editar Asignatura' : 'Nueva Asignatura'}
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
            <label className='block text-sm font-medium text-gray-700'>
              Nombre de la Asignatura *
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Ej: Matemáticas, Lengua y Literatura, Ciencias...'
              maxLength={120}
            />
            <p className='mt-1 text-sm text-gray-500'>
              Nombre completo de la asignatura (máx. 120 caracteres)
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
              placeholder='Ej: MAT, LL, CN...'
              maxLength={30}
            />
            <p className='mt-1 text-sm text-gray-500'>
              Código corto para identificar la asignatura (máx. 30 caracteres)
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
              Asignatura activa
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
              {editingSubject ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function SectionsContent() {
  const [sections, setSections] = useState([]);
  const [grades, setGrades] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    grade: '',
    name: '',
    capacity: 30,
    is_active: true,
  });

  const columns = [
    {
      key: 'level_name',
      title: 'Nivel',
      render: (item) => item.level_name || 'N/A',
    },
    {
      key: 'grade_name',
      title: 'Grado',
      render: (item) => item.grade_name || 'N/A',
    },
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

  const fetchGrades = async () => {
    try {
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
      console.error('Error loading grades:', err);
    }
  };

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`api/sections`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar secciones');

      const data = await response.json();

      // Enriquecer datos con información de grado y nivel
      const sectionsEnriched = data.map((section) => {
        const grade = grades.find((g) => g.id === section.grade);
        return {
          ...section,
          grade_name: grade?.name || 'N/A',
          level_name: grade?.level_name || 'N/A',
        };
      });

      setSections(sectionsEnriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSection ? `api/sections/${editingSection.id}` : `api/sections`;

      const method = editingSection ? 'PUT' : 'POST';

      // Preparar datos para enviar
      const submitData = {
        ...formData,
        grade: parseInt(formData.grade),
        capacity: parseInt(formData.capacity),
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
        throw new Error(errorData.detail || 'Error al guardar sección');
      }

      await fetchSections();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta sección?')) return;

    try {
      const response = await fetch(`api/sections/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar sección');

      await fetchSections();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      grade: section.grade.toString(),
      name: section.name,
      capacity: section.capacity,
      is_active: section.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      grade: '',
      name: '',
      capacity: 30,
      is_active: true,
    });
    setEditingSection(null);
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

  // Cuando levels se cargue, cargar grades
  useEffect(() => {
    if (levels.length > 0) {
      fetchGrades();
    }
  }, [levels]);

  // Cuando grades se cargue, cargar sections
  useEffect(() => {
    if (grades.length > 0) {
      fetchSections();
    }
  }, [grades]);

  if (loading) return <div className='py-8 text-center'>Cargando secciones...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Secciones/Paralelos</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          disabled={grades.length === 0}
        >
          + Nueva Sección
        </button>
      </div>

      {grades.length === 0 && (
        <div className='mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-700'>
          Primero debe crear grados para poder agregar secciones.
        </div>
      )}

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={sections} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingSection ? 'Editar Sección' : 'Nueva Sección'}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Grado *</label>
            <select
              required
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            >
              <option value=''>Seleccione un grado</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.level_name} - {grade.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Nombre de la Sección *
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Ej: A, B, C...'
              maxLength={5}
            />
            <p className='mt-1 text-sm text-gray-500'>
              Letra o identificador de la sección (máx. 5 caracteres)
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Capacidad *</label>
            <input
              type='number'
              required
              min='1'
              max='50'
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: parseInt(e.target.value) || 30 })
              }
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            />
            <p className='mt-1 text-sm text-gray-500'>
              Número máximo de estudiantes en esta sección
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
              Sección activa
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
              {editingSection ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

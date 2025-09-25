import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function StudentsContent() {
  const [students, setStudents] = useState([]);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    person: '',
    code: '',
    admission_date: '',
    notes: '',
    is_active: true,
  });

  const columns = [
    { key: 'code', title: 'Código Estudiante' },
    {
      key: 'full_name',
      title: 'Estudiante',
      render: (item) => item.person_name || 'N/A',
    },
    {
      key: 'doc_number',
      title: 'Documento',
      render: (item) => item.person_doc_number || 'N/A',
    },
    {
      key: 'admission_date',
      title: 'Fecha Ingreso',
      render: (item) =>
        item.admission_date ? new Date(item.admission_date).toLocaleDateString() : 'N/A',
    },
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

  const fetchPersons = async () => {
    try {
      const response = await fetch(`api/persons`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar personas');

      const data = await response.json();
      setPersons(data);
    } catch (err) {
      console.error('Error loading persons:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`api/students`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar estudiantes');

      const data = await response.json();

      // Enriquecer datos con información de la persona
      const studentsEnriched = data.map((student) => {
        const person = persons.find((p) => p.id === student.person);
        return {
          ...student,
          person_name: person ? `${person.first_name} ${person.last_name}` : 'N/A',
          person_doc_number: person?.doc_number || 'N/A',
        };
      });

      setStudents(studentsEnriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingStudent ? `api/students/${editingStudent.id}` : `api/students`;

      const method = editingStudent ? 'PUT' : 'POST';

      // Preparar datos para enviar
      const submitData = {
        ...formData,
        person: parseInt(formData.person),
        admission_date: formData.admission_date || null,
        notes: formData.notes || '',
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
        throw new Error(errorData.detail || 'Error al guardar estudiante');
      }

      await fetchStudents();
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
        '¿Está seguro de eliminar este estudiante?\n\nNota: Esta acción eliminará el registro de estudiante, pero no la persona asociada.'
      )
    )
      return;

    try {
      const response = await fetch(`api/students/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar estudiante');

      await fetchStudents();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      person: student.person.toString(),
      code: student.code,
      admission_date: student.admission_date || '',
      notes: student.notes || '',
      is_active: student.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      person: '',
      code: '',
      admission_date: '',
      notes: '',
      is_active: true,
    });
    setEditingStudent(null);
  };

  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  // Generar código automático sugerido
  const generateSuggestedCode = () => {
    if (students.length === 0) return 'STU-0001';

    const lastCode = students[0].code; // Asumiendo que están ordenados
    const match = lastCode.match(/(\d+)$/);
    if (match) {
      const lastNumber = parseInt(match[1]);
      return `STU-${String(lastNumber + 1).padStart(4, '0')}`;
    }
    return 'STU-0001';
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchPersons();
    };
    loadInitialData();
  }, []);

  // Cuando persons se cargue, cargar students
  useEffect(() => {
    if (persons.length > 0) {
      fetchStudents();
    }
  }, [persons]);

  if (loading) return <div className='py-8 text-center'>Cargando estudiantes...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Estudiantes</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          disabled={persons.length === 0}
        >
          + Nuevo Estudiante
        </button>
      </div>

      {persons.length === 0 && (
        <div className='mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-700'>
          Primero debe crear personas para poder registrarlas como estudiantes.
        </div>
      )}

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={students} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        size='lg'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Persona *</label>
            <select
              required
              value={formData.person}
              onChange={(e) => setFormData({ ...formData, person: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            >
              <option value=''>Seleccione una persona</option>
              {persons
                .filter((person) => person.is_active)
                .map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name} - {person.doc_type}: {person.doc_number}
                  </option>
                ))}
            </select>
            <p className='mt-1 text-sm text-gray-500'>
              Solo se muestran personas activas que no están registradas como estudiantes
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Código de Estudiante *
            </label>
            <div className='flex space-x-2'>
              <input
                type='text'
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
                placeholder='Ej: STU-0001'
                maxLength={30}
              />
              {!editingStudent && (
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, code: generateSuggestedCode() })}
                  className='mt-1 rounded-lg bg-gray-200 px-3 py-2 text-sm whitespace-nowrap hover:bg-gray-300'
                >
                  Sugerir
                </button>
              )}
            </div>
            <p className='mt-1 text-sm text-gray-500'>Código único identificador del estudiante</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Fecha de Ingreso</label>
            <input
              type='date'
              value={formData.admission_date}
              onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              max={new Date().toISOString().split('T')[0]}
            />
            <p className='mt-1 text-sm text-gray-500'>
              Fecha en que el estudiante ingresó a la institución
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Notas u Observaciones</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Información adicional sobre el estudiante...'
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
              Estudiante activo
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
              {editingStudent ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function PersonsContent() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    doc_type: 'CI',
    doc_number: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    is_active: true,
  });

  const docTypeOptions = [
    { value: 'CI', label: 'Cédula de Identidad' },
    { value: 'PAS', label: 'Pasaporte' },
    { value: 'DNI', label: 'Documento Nacional de Identidad' },
    { value: 'RUC', label: 'Registro Único de Contribuyente' },
    { value: 'OTRO', label: 'Otro' },
  ];

  const columns = [
    {
      key: 'full_name',
      title: 'Nombre Completo',
      render: (item) => `${item.first_name} ${item.last_name}`,
    },
    { key: 'doc_type', title: 'Tipo Doc.' },
    { key: 'doc_number', title: 'Número Doc.' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Teléfono' },
    {
      key: 'birth_date',
      title: 'Fecha Nac.',
      render: (item) => (item.birth_date ? new Date(item.birth_date).toLocaleDateString() : 'N/A'),
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
      setLoading(true);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPerson ? `api/persons/${editingPerson.id}` : `api/persons`;

      const method = editingPerson ? 'PUT' : 'POST';

      // Preparar datos para enviar (manejar campos vacíos)
      const submitData = {
        ...formData,
        doc_type: formData.doc_type || 'CI',
        // Campos opcionales que pueden ser vacíos
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        birth_date: formData.birth_date || null,
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
        throw new Error(errorData.detail || 'Error al guardar persona');
      }

      await fetchPersons();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm('¿Está seguro de eliminar esta persona?\n\nNota: Esta acción no se puede deshacer.')
    )
      return;

    try {
      const response = await fetch(`api/persons/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar persona');

      await fetchPersons();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      first_name: person.first_name || '',
      last_name: person.last_name || '',
      doc_type: person.doc_type || 'CI',
      doc_number: person.doc_number || '',
      email: person.email || '',
      phone: person.phone || '',
      address: person.address || '',
      birth_date: person.birth_date || '',
      is_active: person.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      doc_type: 'CI',
      doc_number: '',
      email: '',
      phone: '',
      address: '',
      birth_date: '',
      is_active: true,
    });
    setEditingPerson(null);
  };

  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  // Calcular edad a partir de la fecha de nacimiento
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  if (loading) return <div className='py-8 text-center'>Cargando personas...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Personas</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
        >
          + Nueva Persona
        </button>
      </div>

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={persons} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingPerson ? 'Editar Persona' : 'Nueva Persona'}
        size='lg'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Nombres *</label>
              <input
                type='text'
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
                placeholder='Ej: Juan Diego'
                maxLength={80}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Apellidos *</label>
              <input
                type='text'
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
                placeholder='Ej: Pérez Espinoza'
                maxLength={120}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Tipo de Documento *</label>
              <select
                required
                value={formData.doc_type}
                onChange={(e) => setFormData({ ...formData, doc_type: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              >
                {docTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Número de Documento *
              </label>
              <input
                type='text'
                required
                value={formData.doc_number}
                onChange={(e) => setFormData({ ...formData, doc_number: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
                placeholder='Ej: 12345678'
                maxLength={40}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email</label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
                placeholder='ejemplo@correo.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Teléfono</label>
              <input
                type='tel'
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
                placeholder='Ej: 70000000'
                maxLength={30}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Dirección</label>
            <input
              type='text'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Ej: Calle 123, Ciudad'
              maxLength={255}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Fecha de Nacimiento</label>
            <input
              type='date'
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              max={new Date().toISOString().split('T')[0]}
            />
            {formData.birth_date && (
              <p className='mt-1 text-sm text-gray-500'>
                Edad: {calculateAge(formData.birth_date)} años
              </p>
            )}
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
              Persona activa
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
              {editingPerson ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import DataTable from '../../components/DataTable';

function StudentsContent() {
  // Estado para los estudiantes
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'María García',
      email: 'maria@email.com',
      grade: '3ro Secundaria',
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      grade: '3ro Secundaria',
      status: 'Activo',
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana@email.com',
      grade: '5to Secundaria',
      status: 'Inactivo',
    },
    {
      id: 4,
      name: 'Javier López',
      email: 'javier@email.com',
      grade: '2do Secundaria',
      status: 'Activo',
    },
  ]);

  // Estado para el formulario de nuevo estudiante
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    status: 'Activo',
  });

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear nuevo estudiante
  const handleCreateStudent = () => {
    const newStudent = {
      id: students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1,
      ...formData,
    };

    setStudents([...students, newStudent]);
    setFormData({ name: '', email: '', grade: '', status: 'Activo' });
    setShowForm(false);
  };

  // Editar estudiante
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowForm(true);
  };

  // Actualizar estudiante
  const handleUpdateStudent = () => {
    setStudents(
      students.map((student) =>
        student.id === editingStudent.id ? { ...formData, id: editingStudent.id } : student
      )
    );
    setFormData({ name: '', email: '', grade: '', status: 'Activo' });
    setEditingStudent(null);
    setShowForm(false);
  };

  // Eliminar estudiante
  const handleDeleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  // Cancelar formulario
  const handleCancel = () => {
    setFormData({ name: '', email: '', grade: '', status: 'Activo' });
    setEditingStudent(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'name',
      title: 'Nombre',
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'grade',
      title: 'Grado',
      render: (student) => (
        <span className='inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800'>
          {student.grade}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      render: (student) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
            student.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {student.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-gray-800'>Gestión de Estudiantes</h2>
        <button
          onClick={() => setShowForm(true)}
          className='flex cursor-pointer items-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700'
        >
          <svg
            className='mr-2 h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            ></path>
          </svg>
          Nuevo Estudiante
        </button>
      </div>

      {/* Formulario de crear/editar estudiante */}
      {showForm && (
        <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-4 text-lg font-medium'>
            {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
          </h3>
          <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Nombre completo
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                placeholder='Nombre del estudiante'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                placeholder='email@ejemplo.com'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Grado</label>
              <select
                name='grade'
                value={formData.grade}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              >
                <option value=''>Seleccionar grado</option>
                <option value='1ro Primaria'>1ro Primaria</option>
                <option value='2do Primaria'>2do Primaria</option>
                <option value='3ro Primaria'>3ro Primaria</option>
                <option value='4to Primaria'>4to Primaria</option>
                <option value='5to Primaria'>5to Primaria</option>
                <option value='6to Primaria'>6to Primaria</option>
                <option value='1ro Secundaria'>1ro Secundaria</option>
                <option value='2do Secundaria'>2do Secundaria</option>
                <option value='3ro Secundaria'>3ro Secundaria</option>
                <option value='4to Secundaria'>4to Secundaria</option>
                <option value='5to Secundaria'>5o Secundaria</option>
                <option value='6to Secundaria'>6to Secundaria</option>
                <option value='PreKinder'>PreKinder</option>
                <option value='Kinder'>Kinder</option>
              </select>
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Estado</label>
              <select
                name='status'
                value={formData.status}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              >
                <option value='Activo'>Activo</option>
                <option value='Inactivo'>Inactivo</option>
              </select>
            </div>
          </div>
          <div className='flex justify-end space-x-3'>
            <button
              onClick={handleCancel}
              className='rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50'
            >
              Cancelar
            </button>
            <button
              onClick={editingStudent ? handleUpdateStudent : handleCreateStudent}
              className='rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700'
            >
              {editingStudent ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={students}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        emptyMessage='No hay estudiantes registrados'
      />
    </div>
  );
}

export default StudentsContent;

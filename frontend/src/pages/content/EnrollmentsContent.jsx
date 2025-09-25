import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function EnrollmentsContent() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    period: '',
    grade: '',
    section: '',
    status: 'ACTIVE',
    notes: '',
  });
  const [availableSections, setAvailableSections] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const statusOptions = [
    { value: 'ACTIVE', label: 'Activa' },
    { value: 'WITHDRAWN', label: 'Retirado' },
    { value: 'TRANSFERRED', label: 'Transferido' },
    { value: 'FINISHED', label: 'Finalizada' },
  ];

  const columns = [
    { key: 'student_code', title: 'Código Est.' },
    {
      key: 'student_name',
      title: 'Estudiante',
      render: (item) => item.student_name || 'N/A',
    },
    { key: 'period_name', title: 'Período' },
    { key: 'grade_name', title: 'Grado' },
    { key: 'section_name', title: 'Sección' },
    {
      key: 'status',
      title: 'Estado',
      render: (item) => {
        const statusConfig = {
          ACTIVE: { class: 'bg-green-100 text-green-800', label: 'Activa' },
          WITHDRAWN: { class: 'bg-red-100 text-red-800', label: 'Retirado' },
          TRANSFERRED: { class: 'bg-blue-100 text-blue-800', label: 'Transferido' },
          FINISHED: { class: 'bg-gray-100 text-gray-800', label: 'Finalizada' },
        };
        const config = statusConfig[item.status] || statusConfig.ACTIVE;

        return (
          <span className={`rounded-full px-2 py-1 text-xs ${config.class}`}>{config.label}</span>
        );
      },
    },
    {
      key: 'enroll_date',
      title: 'Fecha Matrícula',
      render: (item) =>
        item.enroll_date ? new Date(item.enroll_date).toLocaleDateString() : 'N/A',
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

  // Fetch de datos maestros
  const fetchStudents = async () => {
    try {
      const response = await fetch(`api/students`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar estudiantes');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error loading students:', err);
      return [];
    }
  };

  const fetchPeriods = async () => {
    try {
      const response = await fetch(`api/periods`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar períodos');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error loading periods:', err);
      return [];
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
      return data;
    } catch (err) {
      console.error('Error loading grades:', err);
      return [];
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch(`api/sections`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar secciones');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error loading sections:', err);
      return [];
    }
  };

  const fetchEnrollments = async (studentsData, periodsData, gradesData, sectionsData) => {
    try {
      setLoading(true);
      const response = await fetch(`api/enrollments`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar matrículas');

      const data = await response.json();

      // Enriquecer datos con información relacionada usando los datos ya cargados
      const enrollmentsEnriched = data.map((enrollment) => {
        const student = studentsData.find((s) => s.id === enrollment.student);
        const period = periodsData.find((p) => p.id === enrollment.period);
        const grade = gradesData.find((g) => g.id === enrollment.grade);
        const section = sectionsData.find((s) => s.id === enrollment.section);

        return {
          ...enrollment,
          student_code: student?.code || 'N/A',
          student_name:
            student?.person_name ||
            student?.person?.first_name + ' ' + student?.person?.last_name ||
            'N/A',
          period_name: period?.name || 'N/A',
          grade_name: grade?.name || 'N/A',
          section_name: section?.name || 'N/A',
        };
      });

      setEnrollments(enrollmentsEnriched);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar secciones disponibles según el grado seleccionado
  const updateAvailableSections = (gradeId) => {
    if (!gradeId) {
      setAvailableSections([]);
      return;
    }
    const filteredSections = sections.filter(
      (section) => section.grade == gradeId && section.is_active
    );
    setAvailableSections(filteredSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEnrollment ? `api/enrollments/${editingEnrollment.id}` : `api/enrollments`;

      const method = editingEnrollment ? 'PUT' : 'POST';

      // Preparar datos para enviar
      const submitData = {
        ...formData,
        student: parseInt(formData.student),
        period: parseInt(formData.period),
        grade: parseInt(formData.grade),
        section: parseInt(formData.section),
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
        throw new Error(errorData.detail || 'Error al guardar matrícula');
      }

      // Recargar todos los datos
      await loadAllData();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta matrícula?\n\nEsta acción no se puede deshacer.'))
      return;

    try {
      const response = await fetch(`api/enrollments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar matrícula');

      // Recargar todos los datos
      await loadAllData();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    setFormData({
      student: enrollment.student.toString(),
      period: enrollment.period.toString(),
      grade: enrollment.grade.toString(),
      section: enrollment.section.toString(),
      status: enrollment.status,
      notes: enrollment.notes || '',
    });
    updateAvailableSections(enrollment.grade.toString());
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      student: '',
      period: '',
      grade: '',
      section: '',
      status: 'ACTIVE',
      notes: '',
    });
    setAvailableSections([]);
    setEditingEnrollment(null);
  };

  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleGradeChange = (gradeId) => {
    setFormData((prev) => ({
      ...prev,
      grade: gradeId,
      section: '', // Reset section cuando cambia el grado
    }));
    updateAvailableSections(gradeId);
  };

  // Función para cargar todos los datos en secuencia
  const loadAllData = async () => {
    try {
      setLoading(true);
      setDataLoaded(false);

      // Cargar todos los datos en paralelo
      const [studentsData, periodsData, gradesData, sectionsData] = await Promise.all([
        fetchStudents(),
        fetchPeriods(),
        fetchGrades(),
        fetchSections(),
      ]);

      // Actualizar estados
      setStudents(studentsData);
      setPeriods(periodsData);
      setGrades(gradesData);
      setSections(sectionsData);

      // Cargar matrículas con los datos ya disponibles
      await fetchEnrollments(studentsData, periodsData, gradesData, sectionsData);
      setDataLoaded(true);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadAllData();
  }, []);

  if (loading && !dataLoaded) return <div className='py-8 text-center'>Cargando matrículas...</div>;
  if (error) return <div className='py-8 text-center text-red-600'>Error: {error}</div>;

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Matrículas</h2>
        <button
          onClick={handleNew}
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          disabled={students.length === 0 || periods.length === 0 || grades.length === 0}
        >
          + Nueva Matrícula
        </button>
      </div>

      {(students.length === 0 || periods.length === 0 || grades.length === 0) && (
        <div className='mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-700'>
          Para crear matrículas, primero debe tener: estudiantes, períodos académicos y grados
          creados.
        </div>
      )}

      {error && <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700'>{error}</div>}

      <DataTable columns={columns} data={enrollments} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingEnrollment ? 'Editar Matrícula' : 'Nueva Matrícula'}
        size='lg'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Estudiante *</label>
              <select
                required
                value={formData.student}
                onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              >
                <option value=''>Seleccione un estudiante</option>
                {students
                  .filter((student) => student.is_active)
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.code} -{' '}
                      {student.person_name ||
                        student.person?.first_name + ' ' + student.person?.last_name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Período Académico *</label>
              <select
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              >
                <option value=''>Seleccione un período</option>
                {periods
                  .filter((period) => period.is_active)
                  .map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Grado *</label>
              <select
                required
                value={formData.grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              >
                <option value=''>Seleccione un grado</option>
                {grades
                  .filter((grade) => grade.is_active)
                  .map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.level_name} - {grade.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Sección *</label>
              <select
                required
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
                disabled={!formData.grade}
              >
                <option value=''>Seleccione una sección</option>
                {availableSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name} (Capacidad: {section.capacity})
                  </option>
                ))}
              </select>
              {!formData.grade && (
                <p className='mt-1 text-sm text-gray-500'>Primero seleccione un grado</p>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Estado de la Matrícula *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Observaciones</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2'
              placeholder='Observaciones adicionales sobre la matrícula...'
            />
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
              {editingEnrollment ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

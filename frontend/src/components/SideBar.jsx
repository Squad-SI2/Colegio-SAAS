import { useState } from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: (
      <svg
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
        ></path>
      </svg>
    ),
  },
  {
    id: 'academic',
    name: 'Gestión Académica',
    icon: (
      <svg
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M12 14l9-5-9-5-9 5 9 5z'
        ></path>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M12 14l9-5-9-5-9 5 9 5zm0 0l-9-5m9 5v6'
        ></path>
      </svg>
    ),
    children: [
      { id: 'students', name: 'Estudiantes' },
      { id: 'teachers', name: 'Profesores' },
      { id: 'courses', name: 'Cursos' },
      { id: 'grades', name: 'Calificaciones' },
    ],
  },
  {
    id: 'reports',
    name: 'Reportes',
    icon: (
      <svg
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        ></path>
      </svg>
    ),
  },
  {
    id: 'settings',
    name: 'Configuración',
    icon: (
      <svg
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
        ></path>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
        ></path>
      </svg>
    ),
  },
];

function Sidebar({ activeSection, setActiveSection }) {
  const [openItems, setOpenItems] = useState({
    academic: false,
    administration: false,
    reports: false,
  });

  const toggleItem = (item) => {
    setOpenItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div className='flex w-64 flex-col bg-indigo-800 text-white'>
      <Link to='/'>
        <div className='flex items-center p-4'>
          <img src='/logo.png' alt='Logo' className='mr-2 h-8 w-auto' />
          <span className='text-xl font-bold'>Panel Admin</span>
        </div>
      </Link>
      <Menu
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        openItems={openItems}
        toggleItem={toggleItem}
      ></Menu>
      <div className='border-t border-indigo-700 p-4'>
        <div className='flex items-center'>
          <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600'>
            <span className='text-sm font-medium'>A</span>
          </div>
          <div className='flex-1'>
            <p className='text-sm font-medium'>Administrador</p>
            <p className='text-xs text-indigo-300'>admin@colegio.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Menu({ activeSection, setActiveSection, openItems, toggleItem }) {
  return (
    <nav className='flex-1 overflow-y-auto pt-2'>
      <ul className='space-y-1 px-2'>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            openItems={openItems}
            toggleItem={toggleItem}
          />
        ))}
      </ul>
    </nav>
  );
}

function MenuItem({ item, activeSection, setActiveSection, openItems, toggleItem }) {
  return (
    <li>
      {item.children ? (
        <>
          <button
            onClick={() => toggleItem(item.id)}
            className={`flex w-full items-center justify-between rounded-lg p-3 transition hover:bg-indigo-700 ${openItems[item.id] ? 'bg-indigo-700' : ''}`}
          >
            <div className='flex items-center'>
              <span className='mr-3'>{item.icon}</span>
              <span>{item.name}</span>
            </div>
            <svg
              className={`h-4 w-4 transition-transform ${openItems[item.id] ? 'rotate-180 transform' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
          {openItems[item.id] && (
            <ul className='mt-1 ml-6 space-y-1'>
              {item.children.map((child) => (
                <li key={child.id}>
                  <button
                    onClick={() => setActiveSection(child.id)}
                    className={`w-full rounded-lg p-2 pl-8 text-left transition hover:bg-indigo-700 ${activeSection === child.id ? 'bg-indigo-600' : ''}`}
                  >
                    {child.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <button
          onClick={() => setActiveSection(item.id)}
          className={`flex w-full items-center rounded-lg p-3 transition hover:bg-indigo-700 ${activeSection === item.id ? 'bg-indigo-600' : ''}`}
        >
          <span className='mr-3'>{item.icon}</span>
          <span>{item.name}</span>
        </button>
      )}
    </li>
  );
}

export default Sidebar;

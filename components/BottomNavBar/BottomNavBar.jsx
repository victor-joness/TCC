import React from 'react';
import { useColorScheme } from '~/lib/useColorScheme';

const HomeIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' style={{ color: 'currentColor' }}>
    <path
      d='M10 19V14H14V19C14 19.5523 14.4477 20 15 20H19C19.5523 20 20 19.5523 20 19V12H21.7071C22.0976 12 22.3929 11.6047 22.2929 11.2142L12.2929 1.21423C12.1055 1.0268 11.8945 1.0268 11.7071 1.21423L1.70711 11.2142C1.60714 11.6047 1.90238 12 2.29289 12H4V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19Z'
    />
  </svg>
);

const DictionaryIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' style={{ color: 'currentColor' }}>
    <path
      d='M5 5C4.44772 5 4 5.44772 4 6V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V6C20 5.44772 19.5523 5 19 5H5ZM6 7H8V17H6V7ZM10 7H18V9H10V7ZM10 11H18V13H10V11ZM10 15H18V17H10V15Z'
    />
  </svg>
);

const ForumIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' style={{ color: 'currentColor' }}>
    <path
      d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 16H13V18H11V16ZM11 6H13V14H11V6Z'
    />
  </svg>
);

const UserIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' style={{ color: 'currentColor' }}>
    <path
      d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.07 18.28C7.5 17.38 10.12 16.5 12 16.5C13.88 16.5 16.51 17.38 16.93 18.28C15.57 19.36 13.86 20 12 20C10.14 20 8.43 19.36 7.07 18.28ZM18.36 16.83C16.93 15.09 13.46 14.5 12 14.5C10.54 14.5 7.07 15.09 5.64 16.83C4.62 15.49 4 13.82 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 13.82 19.38 15.49 18.36 16.83ZM12 6C10.06 6 8.5 7.56 8.5 9.5C8.5 11.44 10.06 13 12 13C13.94 13 15.5 11.44 15.5 9.5C15.5 7.56 13.94 6 12 6Z'
    />
  </svg>
);

const BottomNavigation = ({ currentPage, onPageChange }) => {
  const { isDarkColorScheme } = useColorScheme(); // Acessando o tema

  const pages = [
    { label: 'Módulos', icon: HomeIcon},
    { label: 'Dicionário', icon: DictionaryIcon },
    { label: 'Fórum', icon: ForumIcon },
    { label: 'Perfil', icon: UserIcon },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: isDarkColorScheme ? '#333' : '#fff',
        padding: '8px 12px',
        width: '100%',
        boxShadow: '0 -2px 4px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      {pages.map((page, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: currentPage === index ? '#0B8DCD' : 'transparent',
            borderRadius: 8,
            gap: 5,
            fill: isDarkColorScheme ? '#fff' : '#333',
          }}
          onClick={() => onPageChange(index)}
        >
          <page.icon />
          <div
            style={{
              fontSize: 16,
              color: isDarkColorScheme ? '#fff' : '#333',
              textAlign: 'center',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {page.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;

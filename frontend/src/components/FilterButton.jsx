import React, { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button, styled } from '@mui/material';
import { motion } from 'framer-motion';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 16px',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '120px',
  justifyContent: 'center',
  backdropFilter: 'blur(8px)',
  '@media (min-width: 640px)': {
    minWidth: '160px',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const DropdownMenu = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  padding: '8px',
  minWidth: '160px',
  zIndex: 50,
  border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
}));

const FilterButton = ({ isActive, onClick, activeText, inactiveText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = () => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <StyledButton
          variant={isActive ? "contained" : "outlined"}
          onClick={handleButtonClick}
          className={`
            ${isActive 
              ? 'bg-primary-600 dark:bg-primary-700 text-white border-primary-600 dark:border-primary-500' 
              : 'bg-transparent dark:bg-transparent text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'
            }
            hover:bg-primary-700 dark:hover:bg-primary-600
            hover:border-primary-700 dark:hover:border-primary-500
            hover:shadow-lg dark:hover:shadow-gray-900/30
            transition-all duration-300
            text-sm sm:text-base
            px-3 sm:px-4
            py-2 sm:py-2.5
          `}
          sx={{
            '& .MuiSvgIcon-root': {
              color: isActive 
                ? 'white' 
                : 'currentColor',
            }
          }}
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          {isActive ? activeText : inactiveText}
        </StyledButton>
      </motion.div>

      {isOpen && (
        <DropdownMenu className="dark:bg-gray-800 dark:border-gray-700">
          <button
            onClick={handleOptionClick}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm sm:text-base
              flex items-center gap-2
              ${isActive 
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200'
              }
              transition-colors duration-200
            `}
          >
            {isActive ? inactiveText : activeText}
          </button>
        </DropdownMenu>
      )}
    </div>
  );
};

export default FilterButton; 
import React from 'react';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            fontSize: '1.5rem', 
            paddingRight: '10px',
            display: 'flex',
            alignItems: 'flex-end' }}
    >
        {children}
    </a>
));

export default CustomToggle;
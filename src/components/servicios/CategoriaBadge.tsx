// CategoriaBadge.tsx
import React from 'react';

interface CategoriaBadgeProps {
    categoria: string;
}

const CategoriaBadge: React.FC<CategoriaBadgeProps> = ({ categoria }) => {
    const getCategoriaStyles = (categoria: string) => {
        switch (categoria.toUpperCase()) {
            case 'TECNOLOGIA': return 'bg-purple-100 text-purple-800';
            case 'MARKETING': return 'bg-blue-100 text-blue-800';
            // ... otros casos
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoriaStyles(categoria)}`}>
      {categoria}
    </span>
    );
};

export default CategoriaBadge;
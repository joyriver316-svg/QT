import React from 'react';

export default function Card({ children, className = "", ...props }) {
    return (
        <div className={`bg-surface rounded-3xl shadow-sm border border-stone-100 p-6 ${className}`} {...props}>
            {children}
        </div>
    );
}

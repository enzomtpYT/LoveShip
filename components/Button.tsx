import React from 'react';
import { Icon } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  icon?: 'arrow-right' | 'check' | 'copy';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 focus:ring-rose-500",
    secondary: "bg-white text-rose-600 hover:bg-rose-50 shadow-md focus:ring-rose-200",
    outline: "border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 focus:ring-rose-200"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Icon name="loading" className="w-5 h-5" /> : children}
      {!loading && icon && <Icon name={icon} className="w-5 h-5" />}
    </button>
  );
};
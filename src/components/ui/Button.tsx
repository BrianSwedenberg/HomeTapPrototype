import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center h-[52px] px-8 rounded-full font-bold text-[17px] cursor-pointer border-none transition-all duration-180 leading-none tracking-[0.1px] disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark active:scale-[0.97] disabled:bg-[#C4B5D9] focus-visible:outline-none focus-visible:shadow-focus',
    secondary:
      'bg-transparent text-text-secondary border-[1.5px] border-border font-semibold text-[15px] hover:text-primary hover:border-primary hover:bg-primary-light',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading ? (
        <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

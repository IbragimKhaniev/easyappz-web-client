
import { ButtonHTMLAttributes, memo } from 'react';
import { cn } from '@/shared/lib/utils/common';
import { UI_ELEMENTS } from '@/shared/config/ui';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  className?: string;
}

export const Button = memo(({ 
  variant = 'primary',
  className,
  children,
  ...props 
}: ButtonProps) => {
  const baseStyles = {
    primary: UI_ELEMENTS.BUTTON.PRIMARY,
    ghost: UI_ELEMENTS.BUTTON.GHOST,
    danger: UI_ELEMENTS.BUTTON.DANGER,
  };

  return (
    <button
      className={cn(
        UI_ELEMENTS.BUTTON.BASE,
        baseStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

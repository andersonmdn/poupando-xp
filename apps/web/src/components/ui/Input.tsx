'use client';

import { Eye, EyeOff } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes, useState } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {/* Label */}
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          {label}
        </label>

        {/* Input Container */}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm',
              'placeholder:text-gray-400 text-white',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              // Adiciona padding à direita se tem ícone de password
              {
                'pr-10': isPasswordType,
              },
              // Estilo de erro
              {
                'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500':
                  error,
              },
              className
            )}
            {...props}
          />

          {/* Botão toggle password visibility */}
          {isPasswordType && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              )}
            </button>
          )}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

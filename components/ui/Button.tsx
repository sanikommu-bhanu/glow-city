import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-gold text-white shadow-gold hover:opacity-95',
    secondary: 'bg-white text-text-primary border border-border hover:bg-cream',
    ghost: 'bg-transparent text-rose-gold hover:bg-rose-gold/8',
    dark: 'bg-gradient-dark text-white hover:opacity-95',
  }
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-xl',
    md: 'px-5 py-3 text-sm rounded-[14px]',
    lg: 'px-6 py-4 text-base rounded-[16px]',
  }

  return (
    <button
      className={cn(
        'font-dm font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'ui-button ui-button--primary',
  secondary: 'ui-button ui-button--secondary',
  ghost: 'ui-button ui-button--ghost',
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'ui-button--sm',
  md: 'ui-button--md',
  lg: 'ui-button--lg',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

function mergeClasses(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => {
    const classes = mergeClasses(variantClassMap[variant], sizeClassMap[size], className)

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {props.children}
      </button>
    )
  },
)

Button.displayName = 'Button'

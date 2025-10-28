import { cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type ReactElement } from 'react'

import { cn } from './utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  ghost: 'ui-button--ghost',
  outline: 'ui-button--outline',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'ui-button--sm',
  md: 'ui-button--md',
  lg: 'ui-button--lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', asChild = false, children, ...props }, ref) => {
    const classes = cn('ui-button', variantClasses[variant], sizeClasses[size], className)

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<Record<string, unknown>>
      const childProps = {
        ...props,
        className: cn(classes, typeof child.props.className === 'string' ? child.props.className : undefined),
        ref
      } as Record<string, unknown>

      return cloneElement(child, childProps)
    }

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

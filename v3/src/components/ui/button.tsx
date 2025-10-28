import { cloneElement, forwardRef, isValidElement } from 'react'
import type { ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { cn, mergeRefs } from './utils'

const variantClasses = {
  primary: 'ui-button ui-button--primary',
  secondary: 'ui-button ui-button--secondary',
  ghost: 'ui-button ui-button--ghost',
  subtle: 'ui-button ui-button--subtle',
} as const

const sizeClasses = {
  md: 'ui-button--md',
  sm: 'ui-button--sm',
  lg: 'ui-button--lg',
} as const

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  fullWidth?: boolean
  asChild?: boolean
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type = 'button',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      asChild = false,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(variantClasses[variant], sizeClasses[size], fullWidth && 'ui-button--full', className)

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>
      const childRef = (child as unknown as { ref?: Ref<HTMLElement> }).ref
      return cloneElement(child, {
        ref: mergeRefs(childRef as Ref<HTMLElement> | undefined, ref),
        className: cn(child.props.className, classes),
      } as Partial<typeof child.props>)
    }

    return (
      <button ref={ref} type={type} className={classes} {...rest}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button

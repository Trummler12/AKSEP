import { cloneElement, forwardRef, isValidElement } from 'react'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactElement } from 'react'
import { cn } from './utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  asChild?: boolean
}

const variantMap: Record<Variant, string> = {
  primary:
    'ui-button--primary',
  secondary:
    'ui-button--secondary',
  ghost:
    'ui-button--ghost',
}

const sizeMap: Record<Size, string> = {
  md: 'ui-button--md',
  lg: 'ui-button--lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', block = false, asChild = false, type = 'button', children, ...rest },
  ref,
) {
  const classes = cn('ui-button', variantMap[variant], sizeMap[size], { 'ui-button--block': block }, className)

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      ...rest,
    } as Partial<typeof child.props>)
  }

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  )
})

export default Button

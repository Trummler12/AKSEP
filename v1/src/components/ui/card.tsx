import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from './utils'

export type CardProps = HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('ui-card', className)} {...props} />
))
Card.displayName = 'Card'

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('ui-card__header', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('ui-card__title', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

export type CardContentProps = HTMLAttributes<HTMLDivElement>
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('ui-card__content', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export type CardFooterProps = HTMLAttributes<HTMLDivElement>
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('ui-card__footer', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

export default Card

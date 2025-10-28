import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
}

export function Card({ className, elevated = false, ...props }: CardProps) {
  const classes = ['ui-card', elevated ? 'ui-card--elevated' : null, className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes} {...props} />
}

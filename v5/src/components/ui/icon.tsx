import type { ReactElement, SVGProps } from 'react'
import { cn } from './utils'

export type IconName =
  | 'Lightbulb'
  | 'Globe'
  | 'Heart'
  | 'Users'
  | 'FileText'
  | 'Calendar'
  | 'ArrowRight'
  | 'Mail'
  | 'MessageCircle'
  | 'Phone'
  | 'Facebook'
  | 'Twitter'
  | 'Youtube'
  | 'MoreHorizontal'

const iconMap: Record<IconName, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  Lightbulb: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M9 18h6m-4 4h2m1-4v1a2 2 0 1 1-4 0v-1m8-8a6 6 0 1 0-12 0c0 2.222 1.204 4.164 3 5.197V16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.803c1.796-1.033 3-2.975 3-5.197"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Globe: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.8 2.5 12.2 0 15m0-15c-2.5 2.8-2.5 12.2 0 15M3 12h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Heart: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Users: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M12 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm6-4a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  FileText: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M8 13h8m-8 4h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Calendar: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M16 2v4m-8-4v4m-5 4h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  ArrowRight: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Mail: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0 8 7 8-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  MessageCircle: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Phone: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.72 19.72 0 0 1-8.59-3.06 19.5 19.5 0 0 1-6-6A19.72 19.72 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.16a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Facebook: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Twitter: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22 4s-.7 2-2 3c1.6 10-9.6 17-18 9a12.94 12.94 0 0 0 9-3s-4-1-4-5c1.5 1 3 1 3 1-3-2-2.5-6 1-7 2 2 5 3 7 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Youtube: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="m10 15 5-3-5-3Z" fill="currentColor" />
    </svg>
  ),
  MoreHorizontal: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  ),
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  const Component = iconMap[name]
  return Component({
    width: size,
    height: size,
    className: cn('ui-icon', className),
    focusable: 'false',
    'aria-hidden': 'true',
    ...props,
  })
}

export default Icon

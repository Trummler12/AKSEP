import type { ReactElement, SVGProps } from 'react'

type IconName =
  | 'Mail'
  | 'MessageCircle'
  | 'Phone'
  | 'Facebook'
  | 'Twitter'
  | 'Youtube'
  | 'Lightbulb'
  | 'Globe'
  | 'Heart'
  | 'Users'
  | 'FileText'
  | 'Calendar'
  | 'ArrowRight'
  | 'Menu'
  | 'X'
  | 'MoreHorizontal'
  | 'ChevronDown'
  | 'ChevronRight'

const iconPaths: Record<IconName, ReactElement> = {
  Mail: (
    <>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  MessageCircle: (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8Z" />
    </>
  ),
  Phone: (
    <>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.18 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </>
  ),
  Facebook: (
    <>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
    </>
  ),
  Twitter: (
    <>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.2 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 6.5-3.8 1.1 0 3-1.2 3-1.2Z" />
    </>
  ),
  Youtube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58Z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </>
  ),
  Lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="m2 9 2-3" />
      <path d="m22 9-2-3" />
      <path d="M12 2a7 7 0 0 0-7 7c0 3.5 2 4.5 2 7h10c0-2.5 2-3.5 2-7a7 7 0 0 0-7-7Z" />
    </>
  ),
  Globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2c3.5 3.5 3.5 18.5 0 22" />
      <path d="M12 2C8.5 5.5 8.5 20.5 12 24" />
    </>
  ),
  Heart: (
    <>
      <path d="M19.5 13.5 12 21l-7.5-7.5a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6Z" />
    </>
  ),
  Users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  FileText: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="9" y2="9" />
    </>
  ),
  Calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  ArrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  Menu: (
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </>
  ),
  X: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  MoreHorizontal: (
    <>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </>
  ),
  ChevronDown: (
    <>
      <polyline points="6 9 12 15 18 9" />
    </>
  ),
  ChevronRight: (
    <>
      <polyline points="9 18 15 12 9 6" />
    </>
  ),
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const icon = iconPaths[name]
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={size}
      role="img"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {icon}
    </svg>
  )
}

export default Icon

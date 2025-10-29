import type { ReactNode, SVGProps } from 'react'

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

const ICON_PATHS: Record<IconName, ReactNode> = {
  Lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a6 6 0 0 0-6 6c0 2.4 1.2 4.2 3 5.6.4.3.6.8.6 1.3V16h6v-1.1c0-.5.2-1 .6-1.3 1.8-1.4 3-3.2 3-5.6a6 6 0 0 0-6-6z" />
    </>
  ),
  Globe: (
    <>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
      <path d="M2 12h20" />
      <path d="M12 2c3 4 3 16 0 20" />
      <path d="M12 2c-3 4-3 16 0 20" />
    </>
  ),
  Heart: (
    <path d="M20.5 8.5a4.5 4.5 0 0 0-7.6-3.2L12 6.2l-.9-.9A4.5 4.5 0 0 0 3.5 8.5c0 1.3.6 2.6 1.6 3.6l6.3 6.3a.9.9 0 0 0 1.2 0l6.3-6.3a5 5 0 0 0 1.6-3.6z" />
  ),
  Users: (
    <>
      <path d="M8 13a4 4 0 1 1 8 0" />
      <path d="M2 19a6 6 0 0 1 20 0" />
      <path d="M7 7a4 4 0 1 1 10 0" />
    </>
  ),
  FileText: (
    <>
      <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M14 2v4h4" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
      <path d="M8 9h4" />
    </>
  ),
  Calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 11h18" />
    </>
  ),
  ArrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  Mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 8.5 12 14l9-5.5" />
    </>
  ),
  MessageCircle: (
    <>
      <path d="M21 11.5a8.5 8.5 0 1 1-4.3-7.4L21 3" />
      <path d="M21 11.5c0 5.3-3.8 9.5-9.5 9.5a9.5 9.5 0 0 1-4.3-1l-4.2 1.2 1.2-4.2A9.5 9.5 0 0 1 3 11.5" />
    </>
  ),
  Phone: (
    <>
      <path d="M5 3h3l2 5-2 1c1 2.5 2.5 4 5 5l1-2 5 2v3a2 2 0 0 1-2 2c-8 0-14-6-14-14a2 2 0 0 1 2-2z" />
    </>
  ),
  Facebook: (
    <path d="M15 8h2.5V4.5H15C12 4.5 10 6.5 10 9.5V11H7.5v3.5H10V22h3.5v-7.5h2.8l.5-3.5H13.5V9.5c0-.9.4-1.5 1.5-1.5z" />
  ),
  Twitter: (
    <path d="M22 5.9a6.2 6.2 0 0 1-1.8.5 3.1 3.1 0 0 0 1.4-1.7 6.2 6.2 0 0 1-2 .8 3.1 3.1 0 0 0-5.3 2.1c0 .3 0 .6.1.8A8.8 8.8 0 0 1 3.2 4.7a3.1 3.1 0 0 0 1 4.2 3.1 3.1 0 0 1-1.4-.4v.1a3.1 3.1 0 0 0 2.5 3 3 3 0 0 1-1.4.1 3.1 3.1 0 0 0 2.9 2.1A6.2 6.2 0 0 1 2 17.6a8.7 8.7 0 0 0 4.8 1.4c5.8 0 9-4.8 9-9v-.4A6.3 6.3 0 0 0 22 5.9z" />
  ),
  Youtube: (
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.7-1.8C18.3 5 12 5 12 5s-6.3 0-7.9.4a2.5 2.5 0 0 0-1.7 1.8A26.4 26.4 0 0 0 2 12a26.4 26.4 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.7 1.8C5.7 18 12 18 12 18s6.3 0 7.9-.4a2.5 2.5 0 0 0 1.7-1.8A26.4 26.4 0 0 0 22 12a26.4 26.4 0 0 0-.4-4.8zM10 15V9l5.2 3z" />
  ),
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: IconName
  size?: number
  title?: string
}

export function Icon({ name, size = 20, title, ...props }: IconProps) {
  const graphic = ICON_PATHS[name]

  if (!graphic) {
    return null
  }

  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-icon={name}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {graphic}
    </svg>
  )
}

export default Icon

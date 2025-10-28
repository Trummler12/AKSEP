import { useId } from 'react'
import type { JSX, SVGProps } from 'react'

type IconName =
  | 'ArrowRight'
  | 'Calendar'
  | 'ChevronDown'
  | 'Facebook'
  | 'FileText'
  | 'Globe'
  | 'Heart'
  | 'Lightbulb'
  | 'Menu'
  | 'Mail'
  | 'MessageCircle'
  | 'MoreHorizontal'
  | 'Phone'
  | 'Twitter'
  | 'Users'
  | 'Youtube'
  | 'X'

const ICON_PATHS: Record<IconName, JSX.Element> = {
  ArrowRight: (
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Calendar: (
    <path
      d="M7 3v2m10-2v2M4.5 8h15M6 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm3 5h4m-4 4h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  ChevronDown: (
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Facebook: (
    <path
      d="M14 9h2.5V6.5A3.5 3.5 0 0 0 13 3h-2a3 3 0 0 0-3 3v3H6v3h2v9h4v-9h2.3L15 9Z"
      fill="currentColor"
    />
  ),
  FileText: (
    <path
      d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0L9 3v5h6M9 13h6M9 17h6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Globe: (
    <path
      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.2 4 5.6 4 9s-1.5 6.8-4 9c-2.5-2.2-4-5.6-4-9s1.5-6.8 4-9Zm-8.5 9h17"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Heart: (
    <path
      d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Lightbulb: (
    <path
      d="M9 18h6m-5 3h4m-2-5a6 6 0 1 1 2.6-11.4c3.1 1.6 3.7 6.4 1 9A4.8 4.8 0 0 0 15 18Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Menu: (
    <path
      d="M4 7h16M4 12h16M4 17h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Mail: (
    <path
      d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm16 0-8 6-8-6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  MessageCircle: (
    <path
      d="M20 11.5a7.5 7.5 0 1 1-3.2-6.1l2.7-1.1-1 3A7.4 7.4 0 0 1 20 11.5Zm0 0a7.5 7.5 0 0 1-7.5 7.5A7.4 7.4 0 0 1 9 17l-3 1 1-3A7.4 7.4 0 0 1 4.5 11.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  MoreHorizontal: (
    <path
      d="M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      fill="currentColor"
    />
  ),
  Phone: (
    <path
      d="M7 4h2l2 4-2 1c.5 1.9 1.6 3 3.5 3.5l1-2 4 2v2a2 2 0 0 1-2 2c-6.1 0-11-4.9-11-11a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Twitter: (
    <path
      d="M21 5.9a4.6 4.6 0 0 1-1.9.7 3.1 3.1 0 0 0 1.4-1.7 6.1 6.1 0 0 1-2.1 1A3 3 0 0 0 12 8.8a8.6 8.6 0 0 1-7-3.7 3 3 0 0 0 .9 4 3 3 0 0 1-1.3-.3v.1a3 3 0 0 0 2.4 3 3 3 0 0 1-1.3 0 3 3 0 0 0 2.8 2.1 6.1 6.1 0 0 1-4.6 1.3 8.6 8.6 0 0 0 13.3-7.1Z"
      fill="currentColor"
    />
  ),
  Users: (
    <path
      d="M7 19a4 4 0 1 1 6.4-3.2A5 5 0 1 1 20 19m-8-8a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Youtube: (
    <path
      d="M20.6 7.2c-.3-1-1-1.8-2-2C16.8 5 12 5 12 5s-4.8 0-6.6.2c-1 .2-1.7 1-2 2C3 9 3 12 3 12s0 3 .4 4.8c.3 1 1 1.8 2 2C7.2 19 12 19 12 19s4.8 0 6.6-.2c1-.2 1.7-1 2-2 .4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10.5 15V9l5 3-5 3Z"
      fill="currentColor"
    />
  ),
  X: (
    <path
      d="m7 7 10 10M17 7 7 17"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: IconName
  title?: string
}

export function Icon({ name, title, focusable = 'false', role, ...props }: IconProps) {
  const titleId = useId()
  const iconNode = ICON_PATHS[name]

  if (!iconNode) {
    return null
  }

  const labelledProps = title
    ? { role: role ?? 'img', 'aria-labelledby': titleId }
    : { role: role ?? 'presentation', 'aria-hidden': 'true' as const }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      focusable={focusable}
      stroke="currentColor"
      fill="none"
      aria-live="off"
      {...labelledProps}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {iconNode}
    </svg>
  )
}

export type { IconName }

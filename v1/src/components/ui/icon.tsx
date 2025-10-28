import { useId, type SVGProps, type JSX } from 'react'

import { cn } from './utils'

export type IconName =
  | 'Aksep'
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
  | 'External'
  | 'ChevronDown'
  | 'ChevronRight'
  | 'ChevronUp'
  | 'Menu'
  | 'Close'
  | 'Dots'

type IconDefinition = {
  viewBox?: string
  render: (id: string) => JSX.Element
}

const iconMap: Record<IconName, IconDefinition> = {
  Aksep: {
    render: (id) => {
      const gradientId = `${id}-gradient`

      return (
        <g>
          <circle cx="12" cy="12" r="11" fill={`url(#${gradientId})`} />
          <path
            d="M12 6.5c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5S15 6.5 12 6.5zm0 8.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8z"
            fill="#ffffff"
            opacity="0.88"
          />
          <path
            d="M12 4.2 13.6 8l4.1.33-3.2 2.64.98 3.94L12 12.56l-3.48 2.35.98-3.94L6.3 8.33 10.4 8z"
            fill="#3EB694"
            opacity="0.85"
          />
          <defs>
            <radialGradient id={gradientId} cx="12" cy="12" r="11" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#3EB694" stopOpacity="0.25" />
              <stop offset="1" stopColor="#322A45" />
            </radialGradient>
          </defs>
        </g>
      )
    }
  },
  Lightbulb: {
    render: () => (
      <path
        fill="currentColor"
        d="M12 3a6 6 0 0 0-3 11.28V16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.72A6 6 0 0 0 12 3zm1 12h-2v-.88a1 1 0 0 0-.55-.89 4 4 0 1 1 3.1 0 1 1 0 0 0-.55.89zM10 19a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z"
      />
    )
  },
  Globe: {
    render: () => (
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm6.92 9H15.4a15.8 15.8 0 0 0-.8-4.66A8 8 0 0 1 18.92 11zm-8.32 0H9.4A13.7 13.7 0 0 1 10.5 6a13.7 13.7 0 0 1 1.1 5zm0 2a13.7 13.7 0 0 1-1.1 5 13.7 13.7 0 0 1-1.1-5zm2 0h1.6a13.7 13.7 0 0 1-1.1 5 13.7 13.7 0 0 1-1.1-5zM8.4 11H5.08A8 8 0 0 1 9.4 6.34 15.8 15.8 0 0 0 8.4 11zm0 2a15.8 15.8 0 0 0 .8 4.66A8 8 0 0 1 5.08 13zm7.2 0h3.32A8 8 0 0 1 14.6 17.66 15.8 15.8 0 0 0 15.6 13z"
      />
    )
  },
  Heart: {
    render: () => (
      <path
        fill="currentColor"
        d="M12 20s-7-4.35-7-9.3A4.7 4.7 0 0 1 9.7 6a4.94 4.94 0 0 1 2.3.58A4.94 4.94 0 0 1 14.3 6 4.7 4.7 0 0 1 19 10.7C19 15.65 12 20 12 20z"
      />
    )
  },
  Users: {
    render: () => (
      <path
        fill="currentColor"
        d="M8 12a4 4 0 1 1 3.87-5.03A4 4 0 1 1 16 12c2.76 0 5 1.79 5 4v2a1 1 0 0 1-1 1h-3.5v-2c0-1.3-.7-2.46-1.83-3.24A3 3 0 0 0 15 11a3 3 0 0 0-2.3-2.9A4 4 0 0 1 12 9a4 4 0 0 1-0.7-.1A3 3 0 0 0 9 11a3 3 0 0 0-.67 1.75C7.2 13.8 6 15 6 16.8V19H3a1 1 0 0 1-1-1v-2c0-2.21 2.24-4 5-4z"
      />
    )
  },
  FileText: {
    render: () => (
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 2.41L17.59 8H14zm-6 4.59h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"
      />
    )
  },
  Calendar: {
    render: () => (
      <path
        fill="currentColor"
        d="M17 4V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm2 16H5V10h14zm0-12H5V6h14z"
      />
    )
  },
  ArrowRight: {
    render: () => (
      <path fill="currentColor" d="M5 12a1 1 0 0 1 1-1h8.59l-3.3-3.29a1 1 0 1 1 1.42-1.42l5 5a1 1 0 0 1 0 1.42l-5 5a1 1 0 0 1-1.42-1.42L14.59 13H6a1 1 0 0 1-1-1z" />
    )
  },
  Mail: {
    render: () => (
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2-8 5-8-5zm0 12H4V8l8 5 8-5z"
      />
    )
  },
  MessageCircle: {
    render: () => (
      <path
        fill="currentColor"
        d="M21 11.5a8.5 8.5 0 0 1-9 8.48l-2.19 1.75A1 1 0 0 1 8 20.97v-2.23A8.5 8.5 0 1 1 21 11.5zm-8.5-6a6.5 6.5 0 1 0 0 13 1 1 0 0 1 .62.21l1.88 1.5v-1.8a1 1 0 0 1 1-1 6.5 6.5 0 0 0 0-13z"
      />
    )
  },
  Phone: {
    render: () => (
      <path
        fill="currentColor"
        d="M17.5 21a13.1 13.1 0 0 1-9.27-3.83A13.1 13.1 0 0 1 4.4 7.9 4.11 4.11 0 0 1 8.5 3.5a1 1 0 0 1 .95.68l1.1 3.3a1 1 0 0 1-.27 1l-1.57 1.57a9.08 9.08 0 0 0 3.24 3.24l1.57-1.57a1 1 0 0 1 1-.27l3.3 1.1a1 1 0 0 1 .68.95 4.11 4.11 0 0 1-4.4 4.1z"
      />
    )
  },
  Facebook: {
    render: () => (
      <path
        fill="currentColor"
        d="M13.5 21v-7h2.1l.4-2.6H13.5V9.2c0-.76.25-1.3 1.3-1.3H16V5.6a14.4 14.4 0 0 0-2.1-.16c-2.08 0-3.5 1.27-3.5 3.6v1.4H8.6V14h1.8v7z"
      />
    )
  },
  Twitter: {
    render: () => (
      <path
        fill="currentColor"
        d="M21 6.42a6.42 6.42 0 0 1-1.89.52 3.28 3.28 0 0 0 1.44-1.81 6.56 6.56 0 0 1-2.07.82 3.25 3.25 0 0 0-5.53 2.22 3.38 3.38 0 0 0 .08.74A9.22 9.22 0 0 1 4.11 5.17a3.26 3.26 0 0 0 1 4.35 3.22 3.22 0 0 1-1.47-.41v.04a3.26 3.26 0 0 0 2.6 3.2 3.25 3.25 0 0 1-1.46.06 3.27 3.27 0 0 0 3 2.23A6.52 6.52 0 0 1 3 17.28a9.18 9.18 0 0 0 5 1.47c6 0 9.29-5 9.29-9.29v-.42A6.66 6.66 0 0 0 21 6.42z"
      />
    )
  },
  Youtube: {
    render: () => (
      <path
        fill="currentColor"
        d="M21.6 8.2a2.3 2.3 0 0 0-1.63-1.63C18.3 6 12 6 12 6s-6.3 0-7.97.57A2.3 2.3 0 0 0 2.4 8.2 24.5 24.5 0 0 0 2 12a24.5 24.5 0 0 0 .4 3.8 2.3 2.3 0 0 0 1.63 1.63C5.7 18 12 18 12 18s6.3 0 7.97-.57A2.3 2.3 0 0 0 21.6 15.8a24.5 24.5 0 0 0 .4-3.8 24.5 24.5 0 0 0-.4-3.8zM10 14.75v-5.5L15 12z"
      />
    )
  },
  External: {
    render: () => (
      <path
        fill="currentColor"
        d="M18 4h-5a1 1 0 0 0 0 2h2.59l-7.3 7.3a1 1 0 1 0 1.42 1.4l7.3-7.28V10a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1zM5 6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-2 0v4H6V7a1 1 0 0 0-1-1z"
      />
    )
  },
  ChevronDown: {
    render: () => <path fill="currentColor" d="M6.7 9.3a1 1 0 0 1 1.4 0L12 13.17l3.9-3.87a1 1 0 1 1 1.4 1.42l-4.6 4.58a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4z" />
  },
  ChevronRight: {
    render: () => <path fill="currentColor" d="M9.3 6.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L12.59 11 9.3 7.7a1 1 0 0 1 0-1.4z" />
  },
  ChevronUp: {
    render: () => <path fill="currentColor" d="M6.7 14.7a1 1 0 0 1 0-1.4l4.6-4.58a1 1 0 0 1 1.4 0l4.6 4.58a1 1 0 0 1-1.4 1.42L12 10.83l-3.9 3.87a1 1 0 0 1-1.4 0z" />
  },
  Menu: {
    render: () => <path fill="currentColor" d="M4 7h16a1 1 0 1 0 0-2H4a1 1 0 0 0 0 2zm0 6h16a1 1 0 1 0 0-2H4a1 1 0 0 0 0 2zm0 6h16a1 1 0 1 0 0-2H4a1 1 0 0 0 0 2z" />
  },
  Close: {
    render: () => <path fill="currentColor" d="m13.41 12 4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59 7.71 6.29a1 1 0 1 0-1.42 1.42L10.59 12l-4.3 4.29a1 1 0 1 0 1.42 1.42L12 13.41l4.29 4.3a1 1 0 0 0 1.42-1.42z" />
  },
  Dots: {
    render: () => <path fill="currentColor" d="M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
  }
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
}

const Icon = ({ name, className, ...props }: IconProps) => {
  const icon = iconMap[name] ?? iconMap.External
  const id = useId()

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox={icon.viewBox ?? '0 0 24 24'}
      className={cn('ui-icon', className)}
      {...props}
    >
      {icon.render(id)}
    </svg>
  )
}

export default Icon

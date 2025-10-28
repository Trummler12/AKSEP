import { forwardRef, memo } from 'react'
import type { ReactElement, SVGProps } from 'react'

type IconDefinition = () => ReactElement

const iconMap = {
  Mail: () => (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <polyline points="3 7.5 12 13 21 7.5" />
    </>
  ),
  MessageCircle: () => (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
    </>
  ),
  Phone: () => (
    <>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.53a16 16 0 0 0 6 6l1.89-1.26a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </>
  ),
  Facebook: () => (
    <>
      <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v9h4v-9h3.3l.7-4H15V6a1 1 0 0 1 1-1h2z" />
    </>
  ),
  Twitter: () => (
    <>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 9-9.4 15.3-16 9.1 1.9.1 3.4-.5 4.7-1.6-2.2-.4-3.5-1.4-4.2-3.5.7.1 1.4.1 2.1-.1-2.4-.5-3.8-2.6-3.7-4.7.6.3 1.3.6 2 .6C2.3 5.4 3 3.1 5 2c2.8 3.3 6.6 5.3 11 5.5-.5-2.2 1.2-4.5 3.5-4.5 1 0 2 .4 2.7 1.1.8-.1 1.6-.4 2.3-.8-.3.8-.8 1.5-1.5 2 .7-.1 1.4-.3 2-.5z" />
    </>
  ),
  Youtube: () => (
    <>
      <path d="M21.8 8s-.2-1.4-.8-2a2.83 2.83 0 0 0-2-.8C16.4 5 12 5 12 5s-4.4 0-7 .2a2.83 2.83 0 0 0-2 .8 3 3 0 0 0-.8 2C2 10.6 2 12 2 12s0 1.4.2 4a3 3 0 0 0 .8 2 2.83 2.83 0 0 0 2 .8c2.6.2 7 .2 7 .2s4.4 0 7-.2a2.83 2.83 0 0 0 2-.8 3 3 0 0 0 .8-2C22 13.4 22 12 22 12s0-1.4-.2-4z" />
      <polygon points="10 15.5 15 12 10 8.5 10 15.5" />
    </>
  ),
  Lightbulb: () => (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 1 4.7 12.1 5 5 0 0 0-1.2 2.9v.5H10.5v-.5a5 5 0 0 0-1.2-2.9A7 7 0 0 1 12 2z" />
    </>
  ),
  Globe: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
    </>
  ),
  Heart: () => (
    <>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </>
  ),
  Users: () => (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.85" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  FileText: () => (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="9" y2="9" />
    </>
  ),
  Calendar: () => (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  ArrowRight: () => (
    <>
      <polyline points="9 18 15 12 9 6" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </>
  ),
  Ellipsis: () => (
    <>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </>
  ),
} satisfies Record<string, IconDefinition>

export type IconName = keyof typeof iconMap

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  decorative?: boolean
  title?: string
}

const IconComponent = forwardRef<SVGSVGElement, IconProps>(
  ({ name, decorative = true, title, className, strokeWidth = 1.5, ...rest }, ref) => {
    const Glyph = iconMap[name]

    if (!Glyph) {
      return null
    }

    const ariaHidden = decorative && !title

    return (
      <svg
        ref={ref}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={ariaHidden ? undefined : 'img'}
        aria-hidden={ariaHidden ? 'true' : undefined}
        aria-label={ariaHidden ? undefined : title ?? name}
        focusable="false"
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        <Glyph />
      </svg>
    )
  }
)

IconComponent.displayName = 'Icon'

export const Icon = memo(IconComponent)

export default Icon

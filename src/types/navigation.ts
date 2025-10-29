// src/types/navigation.ts
export type LinkItem = {
  label: string
  href: string
  external?: boolean
  icon?: string
}

export type SocialLink = {
  label: string
  href: string
  icon?: string
  iconName?: string // wird in footer.ts verwendet
}

export type NavChild = {
  label: string
  href: string
  key?: string
}

export type NavChildGroup = {
  label?: string
  items: NavChild[]
  key?: string // wird in navigation.ts verwendet
  showTopBorder?: boolean
}

export type NavItem = {
  label: string
  href?: string
  groups?: NavChildGroup[]
  cta?: boolean
  align?: 'left' | 'right'
  key?: string               // wird in navigation.ts verwendet
  displayInPrimary?: boolean // wird in navigation.ts verwendet
}

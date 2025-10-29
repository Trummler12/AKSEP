import '../styles/components/shared.css'

const goalImages = {
  start0: new URL('../../goal/start0.png', import.meta.url).href,
  navbar1: new URL('../../goal/navbar1.png', import.meta.url).href,
  navbar2: new URL('../../goal/navbar2.png', import.meta.url).href,
  navbar3: new URL('../../goal/navbar3.png', import.meta.url).href,
  navbar4a: new URL('../../goal/navbar4a.png', import.meta.url).href,
  navbar4b: new URL('../../goal/navbar4b.png', import.meta.url).href,
  navbar5: new URL('../../goal/navbar5.png', import.meta.url).href,
  placeholder_page: new URL('../../goal/placeholder_page.png', import.meta.url).href,
  sidebar: new URL('../../goal/sidebar.png', import.meta.url).href,
} as const

type GoalKey = keyof typeof goalImages

const goalAlt: Record<GoalKey, string> = {
  start0: 'Gestaltungsvorgabe für die Startseite',
  navbar1: 'Navigation Referenz 1',
  navbar2: 'Navigation Referenz 2',
  navbar3: 'Navigation Referenz 3',
  navbar4a: 'Navigation Referenz 4a',
  navbar4b: 'Navigation Referenz 4b',
  navbar5: 'Navigation Referenz 5',
  placeholder_page: 'Platzhalterseiten-Referenz',
  sidebar: 'Sidebar-Referenzlayout',
}

export interface GoalImagePageProps {
  imageKey: GoalKey
}

export default function GoalImagePage({ imageKey }: GoalImagePageProps) {
  const src = goalImages[imageKey]
  const alt = goalAlt[imageKey]

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0717',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: 'min(1200px, 100%)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
          borderRadius: '12px',
        }}
      />
    </div>
  )
}

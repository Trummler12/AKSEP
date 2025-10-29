import { Link } from 'react-router-dom'
import '../styles/components/hero.css'
import '../styles/components/content-sections.css'
import '../styles/pages/homepage.css'
import { startPageContent } from '../data/startpage'
import Button from '../components/ui/button'
import Icon from '../components/ui/icon'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

const heroPillars = [
  {
    icon: 'Lightbulb' as const,
    title: 'Bildung revolutionieren',
    description: 'Digitale, inklusive Lernangebote für alle Generationen.',
  },
  {
    icon: 'Users' as const,
    title: 'AKSEPtanz leben',
    description: 'Gesellschaft ohne Benachteiligung – evidenzbasiert gestaltet.',
  },
  {
    icon: 'Globe' as const,
    title: 'Europa stärken',
    description: 'Vertrauenswürdige Informationspolitik für ein vereintes Europa.',
  },
]

export default function StartPage() {
  const { aksepDescription, programSection, programHighlights, newsSection, newsItems, participationSection } = startPageContent

  return (
    <div className="homepage">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">DIE AKSEP</p>
            <h1 className="hero__title">Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei</h1>
            <p className="hero__subtitle">{aksepDescription.description}</p>
            <div className="hero__actions">
              <Button size="lg" asChild>
                <Link to="/programm">Unser Programm</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link to="/mitglied-werden">Mitglied werden</Link>
              </Button>
            </div>
            <div className="hero__pillars">
              {heroPillars.map((pillar) => (
                <div key={pillar.title} className="hero__pillar">
                  <span className="hero__pillar-icon" aria-hidden="true">
                    <Icon name={pillar.icon} size={24} />
                  </span>
                  <div>
                    <p className="hero__pillar-title">{pillar.title}</p>
                    <p className="hero__pillar-description">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__orb" />
            <div className="hero__logo-blur">
              <Icon name="Globe" size={120} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--highlights">
        <div className="container section__header">
          <div>
            <p className="section__eyebrow">{programSection.title}</p>
            <h2 className="section__title">Unsere Arbeitsgruppen im Überblick</h2>
          </div>
          <p className="section__description">{programSection.description}</p>
        </div>
        <div className="container highlights__grid">
          {programHighlights.map((highlight) => (
            <Card key={highlight.title} className="highlights__card">
              <CardHeader>
                <span className="highlights__icon" aria-hidden="true">
                  <Icon name={highlight.iconName} size={28} />
                </span>
                <CardTitle>{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{highlight.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link to={highlight.href} className="section__link">
                  {highlight.label}
                  <Icon name="ArrowRight" size={18} />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="section section--news">
        <div className="container section__header">
          <div>
            <p className="section__eyebrow">{newsSection.title}</p>
            <h2 className="section__title">{newsSection.description}</h2>
          </div>
        </div>
        <div className="container news__grid">
          {newsItems.map((item) => (
            <Card key={item.title} className="news__card">
              <CardHeader>
                <p className="news__date">{item.date}</p>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
              <CardFooter>
                {item.href.startsWith('http') ? (
                  <a href={item.href} target="_blank" rel="noreferrer noopener" className="section__link">
                    {item.label}
                    <Icon name="ArrowRight" size={18} />
                  </a>
                ) : (
                  <Link to={item.href} className="section__link">
                    {item.label}
                    <Icon name="ArrowRight" size={18} />
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="section section--cta">
        <div className="container cta__inner">
          <div>
            <h2 className="cta__title">{participationSection.title}</h2>
            <p className="cta__description">{participationSection.description}</p>
          </div>
          <div className="cta__actions">
            <Button size="lg" asChild>
              <Link to="/unterstuetzen">Unterstützen</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/kontakt">Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { startPageContent } from '../data/startpage'
import PageShell from '../components/page-shell'
import { Button } from '../components/ui/button'
import Icon from '../components/ui/icon'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const pillars = startPageContent.aksepDescription.subtitle.split('·').map((item) => item.trim())

export default function StartPage() {
  return (
    <PageShell>
      <article className="homepage">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero__content">
            <div className="hero__badge">DIE AKSEP</div>
            <h1 className="hero__title" id="hero-heading">
              Für eine informierte und transparente Politik
            </h1>
            <p className="hero__description">
              Wir verbinden Bildung, Medien und Digitalisierung zu einem integrativen Ansatz für evidenzbasierte Politik und AKSEPtanz.
            </p>
            <div className="hero__actions">
              <Button asChild className="hero__cta" size="lg">
                <Link to="/programm">Unser Programm</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/mitglied-werden">Mitglied werden</Link>
              </Button>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__logo">
              <span className="hero__logo-glow" />
              <span className="hero__logo-core" />
              <span className="hero__logo-ring" />
            </div>
            <ul className="hero__pillars">
              {pillars.map((pillar) => (
                <li key={pillar} className="hero__pillar">
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="content-section" aria-labelledby="program-highlights">
          <header className="content-section__header">
            <h2 className="content-section__title" id="program-highlights">
              {startPageContent.programSection.title}
            </h2>
            <p className="content-section__subtitle">{startPageContent.programSection.description}</p>
          </header>
          <div className="content-section__grid">
            {startPageContent.programHighlights.map((highlight) => (
              <Card key={highlight.label} className="highlight-card">
                <CardHeader className="highlight-card__header">
                  <span className="highlight-card__icon" aria-hidden="true">
                    <Icon name={highlight.iconName} className="highlight-card__icon-svg" />
                  </span>
                  <CardTitle className="highlight-card__title">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent className="highlight-card__content">
                  <CardDescription>{highlight.description}</CardDescription>
                  <Button asChild variant="subtle" className="highlight-card__link">
                    <Link to={highlight.href}>{highlight.label}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="content-section" aria-labelledby="news">
          <header className="content-section__header">
            <h2 className="content-section__title" id="news">
              {startPageContent.newsSection.title}
            </h2>
            <p className="content-section__subtitle">{startPageContent.newsSection.description}</p>
          </header>
          <div className="content-section__grid content-section__grid--news">
            {startPageContent.newsItems.map((news) => (
              <Card key={news.label} className="news-card">
                <CardHeader className="news-card__header">
                  <span className="news-card__date">{news.date}</span>
                  <CardTitle className="news-card__title">{news.title}</CardTitle>
                </CardHeader>
                <CardContent className="news-card__content">
                  <CardDescription>{news.description}</CardDescription>
                  <Button asChild variant="ghost" className="news-card__link">
                    <Link to={news.href}>{news.label}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="cta-strip" aria-labelledby="cta-strip-heading">
          <div className="cta-strip__inner">
            <div>
              <h2 className="cta-strip__title" id="cta-strip-heading">
                {startPageContent.participationSection.title}
              </h2>
              <p className="cta-strip__description">{startPageContent.participationSection.description}</p>
            </div>
            <div className="cta-strip__actions">
              <Button asChild size="lg" variant="primary">
                <Link to="/unterstuetzen">Unterstützen</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/kontakt">Kontakt</Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageShell>
  )
}

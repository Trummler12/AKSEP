import { Link } from 'react-router-dom'

import Button from '../components/ui/button'
import Card, { CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import Icon from '../components/ui/icon'
import { startPageContent } from '../data/startpage'
import '../styles/components/hero.css'
import '../styles/components/content-sections.css'
import '../styles/pages/homepage.css'

import logo from '../assets/Logo_AKSEP.png'

const StartPage = () => {
  const { aksepDescription, programHighlights, newsItems, programSection, newsSection, participationSection } =
    startPageContent

  const pillars = aksepDescription.subtitle.split('·').map((value) => value.trim()).filter(Boolean)

  return (
    <div className="homepage">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__content">
          <div className="hero__logo-wrapper" aria-hidden="true">
            <img src={logo} alt="" className="hero__logo" />
          </div>
          <div className="hero__text">
            <p className="hero__eyebrow">DIE AKSEP</p>
            <h1 id="hero-heading" className="hero__title">
              Informationspolitik als Hauptfokus: Für eine informierte und transparente Politik.
            </h1>
            <p className="hero__subtitle">Wir verbinden Bildung, Medien und Digitalisierung zu einem integrativen Ansatz.</p>
            <div className="hero__pillars" role="list">
              {pillars.map((pillar) => (
                <span key={pillar} role="listitem" className="hero__pillar">
                  <Icon name="ArrowRight" className="hero__pillar-icon" />
                  {pillar}
                </span>
              ))}
            </div>
            <div className="hero__actions">
              <Button asChild>
                <Link to="/programm">Unser Programm</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/mitglied-werden">Mitglied werden</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section content-section--intro" aria-labelledby="aksep-meaning">
        <div className="content-section__intro">
          <div>
            <h2 id="aksep-meaning" className="content-section__title">
              {aksepDescription.title}
            </h2>
            <p className="content-section__description">{aksepDescription.description}</p>
          </div>
          <Card className="content-card content-card--quote">
            <CardHeader className="content-card__header">
              <span className="content-card__icon" aria-hidden="true">
                <Icon name="Lightbulb" />
              </span>
              <CardTitle className="content-card__title">{startPageContent.informationPolitics.title}</CardTitle>
            </CardHeader>
            <CardContent className="content-card__body">
              {startPageContent.informationPolitics.description}
            </CardContent>
            <CardFooter className="content-card__footer">
              <p className="content-card__quote">{startPageContent.informationPolitics.quote}</p>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="content-section" aria-labelledby="program-highlights">
        <header className="content-section__header">
          <h2 id="program-highlights" className="content-section__title">
            {programSection.title}
          </h2>
          <p className="content-section__description">{programSection.description}</p>
        </header>
        <div className="content-section__grid">
          {programHighlights.map((highlight) => (
            <Card key={highlight.label} className="content-card">
              <CardHeader className="content-card__header">
                <span className="content-card__icon" aria-hidden="true">
                  <Icon name={highlight.iconName} />
                </span>
                <CardTitle className="content-card__title">{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent className="content-card__body">{highlight.description}</CardContent>
              <CardFooter className="content-card__footer">
                <Link to={highlight.href} className="content-card__link">
                  {highlight.label}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="news-section">
        <header className="content-section__header">
          <h2 id="news-section" className="content-section__title">
            {newsSection.title}
          </h2>
          <p className="content-section__description">{newsSection.description}</p>
        </header>
        <div className="content-section__grid content-section__grid--news">
          {newsItems.map((item) => (
            <Card key={item.label} className="news-card">
              <CardHeader className="news-card__header">
                <span className="news-card__date">{item.date}</span>
                <CardTitle className="news-card__title">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="news-card__body">{item.description}</CardContent>
              <CardFooter className="news-card__footer">
                {item.href.startsWith('http') ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="content-card__link">
                    Weiterlesen
                  </a>
                ) : (
                  <Link to={item.href} className="content-card__link">
                    Weiterlesen
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="cta-section__content">
          <div>
            <h2 id="cta-heading" className="cta-section__title">
              {participationSection.title}
            </h2>
            <p className="cta-section__description">{participationSection.description}</p>
          </div>
          <div className="cta-section__actions">
            <Button asChild>
              <Link to="/mitmachen">Mitmachen</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/unterstuetzen">Unterstützen</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StartPage

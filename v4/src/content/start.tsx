import { NavLink } from 'react-router-dom'
import { startPageContent } from '../data/startpage'
import { Icon } from '../components/ui/icon'
import { Card } from '../components/ui/card'
import heroLogo from '../assets/Logo_AKSEP.png'

const {
  aksepDescription,
  programSection,
  newsSection,
  participationSection,
  programHighlights,
  newsItems,
  informationPolitics,
} = startPageContent

const pillars = aksepDescription.subtitle.split('·').map((pillar) => pillar.trim())

export default function StartPage() {
  return (
    <div className="homepage">
      <Hero />
      <ProgramHighlights />
      <NewsSection />
      <ParticipationStrip />
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__inner">
        <div className="hero__visual" aria-hidden="true">
          <img src={heroLogo} alt="" className="hero__logo" />
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow">DIE AKSEP</p>
          <h1 id="hero-heading" className="hero__title">
            {informationPolitics.title}
          </h1>
          <p className="hero__subtitle">{informationPolitics.description}</p>
          <p className="hero__description">{aksepDescription.description}</p>
          <div className="hero__pillars" aria-label={aksepDescription.title} role="list">
            {pillars.map((pillar) => (
              <span key={pillar} className="hero__pillar" role="listitem">
                {pillar}
              </span>
            ))}
          </div>
          <div className="hero__actions">
            <NavLink to="/programm" className="ui-button ui-button--primary ui-button--lg">
              Unser Programm
            </NavLink>
            <NavLink to="/mitglied-werden" className="ui-button ui-button--secondary ui-button--lg">
              Mitglied werden
            </NavLink>
          </div>
        </div>
      </div>
      <blockquote className="hero__quote">{informationPolitics.quote}</blockquote>
    </section>
  )
}

function ProgramHighlights() {
  return (
    <section className="content-section content-section--highlights" aria-labelledby="highlights-heading">
      <div className="content-section__header">
        <h2 id="highlights-heading" className="content-section__title">
          {programSection.title}
        </h2>
        <p className="content-section__subtitle">{programSection.description}</p>
      </div>
      <div className="content-section__grid">
        {programHighlights.map((highlight) => (
          <Card key={highlight.title} className="content-card">
            <div className="content-card__icon" aria-hidden="true">
              <Icon name={highlight.iconName} />
            </div>
            <h3 className="content-card__title">{highlight.title}</h3>
            <p className="content-card__description">{highlight.description}</p>
            <NavLink to={highlight.href} className="content-card__link">
              <span>{highlight.label}</span>
              <Icon name="ArrowRight" className="content-card__link-icon" aria-hidden="true" />
            </NavLink>
          </Card>
        ))}
      </div>
    </section>
  )
}

function NewsSection() {
  return (
    <section className="content-section content-section--news" aria-labelledby="news-heading">
      <div className="content-section__header">
        <h2 id="news-heading" className="content-section__title">
          {newsSection.title}
        </h2>
        <p className="content-section__subtitle">{newsSection.description}</p>
      </div>
      <div className="content-section__grid content-section__grid--news">
        {newsItems.map((news) => (
          <Card key={news.title} className="news-card">
            <p className="news-card__date">{news.date}</p>
            <h3 className="news-card__title">{news.title}</h3>
            <p className="news-card__description">{news.description}</p>
            <NavLink to={news.href} className="news-card__link">
              Weiterlesen
              <Icon name="ArrowRight" className="news-card__link-icon" aria-hidden="true" />
            </NavLink>
          </Card>
        ))}
      </div>
    </section>
  )
}

function ParticipationStrip() {
  return (
    <section className="cta-strip" aria-labelledby="cta-heading">
      <div className="cta-strip__inner">
        <div>
          <h2 id="cta-heading" className="cta-strip__title">
            {participationSection.title}
          </h2>
          <p className="cta-strip__description">{participationSection.description}</p>
        </div>
        <div className="cta-strip__actions">
          <NavLink to="/unterstuetzen" className="ui-button ui-button--primary ui-button--lg">
            Unterstützen
          </NavLink>
          <NavLink to="/kontakt" className="ui-button ui-button--ghost ui-button--lg">
            Kontakt aufnehmen
          </NavLink>
        </div>
      </div>
    </section>
  )
}

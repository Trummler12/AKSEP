import { Link } from 'react-router-dom'
import logo from '../assets/Logo_AKSEP.png'
import Icon from '../components/ui/icon'
import {
  newsItems,
  programHighlights,
  startPageContent,
} from '../data/startpage'
import '../styles/components/hero.css'
import '../styles/components/content-sections.css'
import '../styles/pages/homepage.css'

const heroSubtitle = 'Für eine informierte und transparente Politik'

export default function StartPage() {
  const pillars = startPageContent.aksepDescription.subtitle
    .split('·')
    .map((entry) => entry.trim())

  return (
    <article className="homepage">
      <section aria-labelledby="hero-heading" className="hero">
        <div className="hero__inner">
          <div className="hero__content">
            <span className="hero__eyebrow">DIE AKSEP</span>
            <h1 className="hero__title" id="hero-heading">
              {heroSubtitle}
            </h1>
            <p className="hero__description">
              {startPageContent.informationPolitics.description}
            </p>
            <div className="hero__cta-group">
              <Link className="hero__button hero__button--primary" to="/programm">
                Unser Programm
              </Link>
              <Link className="hero__button hero__button--ghost" to="/mitglied-werden">
                Mitglied werden
              </Link>
            </div>
            <p className="hero__quote">{startPageContent.informationPolitics.quote}</p>
          </div>
          <div className="hero__media" aria-hidden="true">
            <div className="hero__orb" />
            <img alt="AKSEP Logo" className="hero__logo" src={logo} />
          </div>
        </div>
      </section>

      <section aria-labelledby="aksep-meaning" className="homepage__section homepage__section--padded">
        <div className="homepage__section-header">
          <h2 className="homepage__heading" id="aksep-meaning">
            {startPageContent.aksepDescription.title}
          </h2>
          <p className="homepage__lead">{startPageContent.aksepDescription.description}</p>
        </div>
        <div className="homepage__pillars" role="list">
          {pillars.map((pillar) => (
            <div className="homepage__pillar" key={pillar} role="listitem">
              {pillar}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="program-highlights" className="homepage__section">
        <div className="homepage__section-header">
          <h2 className="homepage__heading" id="program-highlights">
            {startPageContent.programSection.title}
          </h2>
          <p className="homepage__lead">{startPageContent.programSection.description}</p>
        </div>
        <div className="homepage__grid">
          {programHighlights.map((highlight) => (
            <article className="homepage-card" key={highlight.label}>
              <div className="homepage-card__icon">
                <Icon name={highlight.iconName} size={28} />
              </div>
              <h3 className="homepage-card__title">{highlight.title}</h3>
              <p className="homepage-card__description">{highlight.description}</p>
              <Link className="homepage-card__link" to={highlight.href}>
                {highlight.label}
                <Icon name="ArrowRight" size={18} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="news-heading" className="homepage__section homepage__section--muted">
        <div className="homepage__section-header">
          <h2 className="homepage__heading" id="news-heading">
            {startPageContent.newsSection.title}
          </h2>
          <p className="homepage__lead">{startPageContent.newsSection.description}</p>
        </div>
        <div className="homepage__grid homepage__grid--news">
          {newsItems.map((news) => {
            const isExternal = /^https?:/i.test(news.href)

            return (
              <article className="homepage-card homepage-card--news" key={news.label}>
                <p className="homepage-card__meta">{news.date}</p>
                <h3 className="homepage-card__title">{news.title}</h3>
                <p className="homepage-card__description">{news.description}</p>
                {isExternal ? (
                  <a
                    className="homepage-card__link"
                    href={news.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Weiterlesen
                    <Icon name="ArrowRight" size={18} />
                  </a>
                ) : (
                  <Link className="homepage-card__link" to={news.href}>
                    Weiterlesen
                    <Icon name="ArrowRight" size={18} />
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="cta-strip" className="homepage__cta">
        <div className="homepage__cta-inner">
          <h2 className="homepage__cta-title" id="cta-strip">
            {startPageContent.participationSection.title}
          </h2>
          <p className="homepage__cta-description">
            {startPageContent.participationSection.description}
          </p>
          <Link className="homepage__cta-button" to="/mitmachen">
            Mitmachen
          </Link>
        </div>
      </section>
    </article>
  )
}

import { startPageContent } from '../data/startpage'
import { Icon } from '../components/ui/icon'
import '../styles/components/hero.css'
import '../styles/components/content-sections.css'
import '../styles/pages/homepage.css'

const heroPillars = startPageContent.aksepDescription.subtitle.split('·').map((pillar) => pillar.trim())

export default function StartPage() {
  return (
    <div className="homepage">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__inner">
          <div className="hero__visual" aria-hidden>
            <div className="hero__orb" />
            <div className="hero__orb-glow" />
          </div>
          <div className="hero__content">
            <span className="hero__eyebrow">Für eine informierte und transparente Politik</span>
            <h1 id="hero-heading" className="hero__title">
              DIE AKSEP
            </h1>
            <p className="hero__description">{startPageContent.aksepDescription.description}</p>
            <ul className="hero__pillars" aria-label="Grundwerte">
              {heroPillars.map((pillar) => (
                <li key={pillar} className="hero__pillar">
                  {pillar}
                </li>
              ))}
            </ul>
            <div className="hero__actions">
              <a className="hero__button hero__button--primary" href="/programm">
                Unser Programm
              </a>
              <a className="hero__button hero__button--ghost" href="/mitglied-werden">
                Mitglied werden
              </a>
            </div>
          </div>
          <aside className="hero__aside" aria-label={startPageContent.informationPolitics.title}>
            <h2 className="hero__aside-title">{startPageContent.informationPolitics.title}</h2>
            <p className="hero__aside-description">{startPageContent.informationPolitics.description}</p>
            <p className="hero__aside-quote">{startPageContent.informationPolitics.quote}</p>
          </aside>
        </div>
      </section>

      <section className="content-section" aria-labelledby="program-highlights-heading">
        <div className="content-section__header">
          <h2 id="program-highlights-heading" className="content-section__title">
            {startPageContent.programSection.title}
          </h2>
          <p className="content-section__subtitle">{startPageContent.programSection.description}</p>
        </div>
        <div className="content-grid">
          {startPageContent.programHighlights.map((highlight) => (
            <article key={highlight.href} className="content-card" aria-labelledby={`${highlight.href}-title`}>
              <div className="content-card__icon">
                <Icon name={highlight.iconName} size={26} aria-hidden />
              </div>
              <h3 id={`${highlight.href}-title`} className="content-card__title">
                {highlight.title}
              </h3>
              <p className="content-card__body">{highlight.description}</p>
              <a className="content-card__link" href={highlight.href}>
                {highlight.label}
                <Icon name="ArrowRight" size={18} aria-hidden className="content-card__link-icon" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="news-heading">
        <div className="content-section__header">
          <h2 id="news-heading" className="content-section__title">
            {startPageContent.newsSection.title}
          </h2>
          <p className="content-section__subtitle">{startPageContent.newsSection.description}</p>
        </div>
        <div className="content-grid content-grid--news">
          {startPageContent.newsItems.map((news) => (
            <article key={news.href} className="news-card" aria-labelledby={`${news.href}-title`}>
              <p className="news-card__date">{news.date}</p>
              <h3 id={`${news.href}-title`} className="news-card__title">
                {news.title}
              </h3>
              <p className="news-card__description">{news.description}</p>
              <a className="news-card__link" href={news.href}>
                Weiterlesen
                <Icon name="ArrowRight" size={18} aria-hidden className="news-card__link-icon" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-strip" aria-labelledby="cta-strip-heading">
        <div className="cta-strip__inner">
          <div>
            <h2 id="cta-strip-heading" className="cta-strip__title">
              {startPageContent.participationSection.title}
            </h2>
            <p className="cta-strip__description">{startPageContent.participationSection.description}</p>
          </div>
          <div className="cta-strip__actions">
            <a className="hero__button hero__button--primary" href="/mitmachen">
              Mitmachen
            </a>
            <a className="hero__button hero__button--ghost" href="/unterstuetzen">
              Unterstützen
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

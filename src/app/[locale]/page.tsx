import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { heroImage, projects, reviews, site, type ServiceKey } from "@/content/site";
import Header from "@/components/Header";
import QuoteForm from "@/components/QuoteForm";
import {
  BathIcon,
  CheckIcon,
  FloorIcon,
  HeroMark,
  HouseIcon,
  KitchenIcon,
  PhoneIcon,
  StairsIcon,
  StarIcon,
} from "@/components/icons";

type Props = { params: Promise<{ locale: string }> };

const serviceOrder: ServiceKey[] = ["kitchens", "bathrooms", "basements", "flooring", "wholeHome"];
const serviceIcons: Record<ServiceKey, React.ReactNode> = {
  kitchens: <KitchenIcon size={34} />,
  bathrooms: <BathIcon />,
  basements: <StairsIcon />,
  flooring: <FloorIcon />,
  wholeHome: <HouseIcon />,
};
const tileClass: Record<ServiceKey, string> = {
  kitchens: "tile tile-feature",
  bathrooms: "tile",
  basements: "tile",
  flooring: "tile",
  wholeHome: "tile tile-accent",
};

function Stars() {
  return (
    <div className="stars" role="img" aria-label="5/5">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  const services = serviceOrder.map((key) => ({ key, ...t.services.items[key] }));
  const [mainReview, ...otherReviews] = reviews;
  const year = new Date().getFullYear();

  return (
    <>
      <a href="#main" className="skip-link">
        {t.nav.skip}
      </a>

      <Header
        locale={locale}
        labels={t.nav}
        showProjects={projects.length > 0}
        showReviews={reviews.length > 0}
      />

      <main id="main">
        {/* ===== Hero ===== */}
        <section id="top" className="hero">
          <div className="container">
            <div className="hero-top">
              <h1>
                {t.hero.titleLine1} <span className="line-2">{t.hero.titleLine2}</span>
              </h1>
              <div className="hero-side">
                <p>{t.hero.subtitle}</p>
                <div className="hero-ctas">
                  <a href="#contact" className="btn btn-white">
                    {t.hero.ctaPrimary}
                  </a>
                  <a href={site.phoneHref} className="btn btn-outline">
                    <PhoneIcon />
                    <span dir="ltr">{site.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              {heroImage ? (
                <Image src={heroImage} alt={t.hero.imageAlt} fill priority sizes="(max-width: 1320px) 100vw, 1320px" />
              ) : (
                <HeroMark className="hero-mark" />
              )}
              <ul className="trust">
                {t.hero.trust.map((item) => (
                  <li key={item}>
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== Services ===== */}
        <section id="services" className="section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">{t.services.title}</h2>
              <p className="section-intro">{t.services.intro}</p>
            </div>
            <div className="tiles">
              {services.map((s) => (
                <article key={s.key} className={tileClass[s.key]}>
                  <span className="tile-icon">{serviceIcons[s.key]}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Process ===== */}
        <section id="process" className="section bg-white light">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">{t.process.title}</h2>
            </div>
            <ol className="steps">
              {t.process.steps.map((step, i) => (
                <li key={step.title}>
                  <div className="step-num">
                    {t.process.stepLabel} {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== Projects (shown once you add projects in src/content/site.ts) ===== */}
        {projects.length > 0 && (
          <section id="projects" className="section">
            <div className="container">
              <div className="section-head">
                <h2 className="section-title">{t.projects.title}</h2>
              </div>
              <div className="projects">
                {projects.map((p) => (
                  <article key={p.image}>
                    <div className="project-photo">
                      <Image src={p.image} alt={p.title} fill sizes="(max-width: 800px) 100vw, 640px" />
                    </div>
                    <div className="project-meta">
                      <h3>{p.title}</h3>
                      <span>
                        {t.services.items[p.type].title}, {p.location}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== Reviews (shown once you add reviews in src/content/site.ts) ===== */}
        {mainReview && (
          <section id="reviews" className="section light">
            <div className="container">
              <div className="section-head">
                <h2 className="section-title">{t.reviews.title}</h2>
              </div>
              <div className="reviews">
                <figure className="review-main" style={{ margin: 0 }}>
                  <Stars />
                  <blockquote>“{mainReview.text}”</blockquote>
                  <figcaption className="review-by">
                    {mainReview.name}
                    <span>, {mainReview.location}</span>
                  </figcaption>
                </figure>
                {otherReviews.length > 0 && (
                  <div className="review-side">
                    {otherReviews.map((r) => (
                      <figure key={r.name + r.text} className="review-small" style={{ margin: 0 }}>
                        <blockquote>“{r.text}”</blockquote>
                        <figcaption className="review-by">
                          {r.name}
                          <span>, {r.location}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ===== Contact ===== */}
        <section id="contact" className="contact-wrap">
          <div className="contact">
            <div className="contact-info">
              <div>
                <h2>
                  {t.contact.titleLine1} <span className="line-2">{t.contact.titleLine2}</span>
                </h2>
                <p>{t.contact.intro}</p>
              </div>
              <dl className="contact-details">
                <div>
                  <dt>{t.contact.call}</dt>
                  <dd>
                    <a href={site.phoneHref}>{site.phoneDisplay}</a>
                  </dd>
                </div>
                <div>
                  <dt>{t.contact.serving}</dt>
                  <dd>{t.contact.servingValue}</dd>
                </div>
              </dl>
            </div>
            <QuoteForm
              locale={locale}
              text={t.contact.form}
              services={services.map(({ key, title }) => ({ key, title }))}
            />
          </div>
        </section>
      </main>

      <footer className="container site-footer">
        <span>
          © {year} {site.name}. {t.footer.rights}
        </span>
        <span>
          {t.footer.tagline} | <a href={site.phoneHref}>{site.phoneDisplay}</a>
        </span>
      </footer>
    </>
  );
}

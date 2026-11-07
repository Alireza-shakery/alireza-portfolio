'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { profile } from '@/content/profile';

const sections = ['home', 'projects', 'about', 'skills', 'contact'] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -65% 0px' },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = menu.current?.querySelector<HTMLElement>('a');
    first?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const focusable = [
          toggle.current,
          ...Array.from(menu.current?.querySelectorAll<HTMLElement>('a,button') ?? []),
        ].filter(Boolean) as HTMLElement[];
        const current = focusable.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && current <= 0) {
          event.preventDefault();
          focusable.at(-1)?.focus();
        } else if (!event.shiftKey && current === focusable.length - 1) {
          event.preventDefault();
          focusable[0]?.focus();
        }
      }
    }
    const desktop = window.matchMedia('(min-width: 768px)');
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', keydown);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    toggle.current?.focus();
  }
  function navigateSection(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    setOpen(false);
    if (isHome) {
      event.preventDefault();
      const section = document.getElementById(id);
      history.pushState(null, '', `#${id}`);
      requestAnimationFrame(() => {
        section?.focus({ preventScroll: true });
        section?.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      });
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {t('skip')}
      </a>
      <header className="header-wrap">
        <div className="site-header">
          <Link className="wordmark" href="/" onClick={() => setOpen(false)}>
            <span className="brand-mark" aria-hidden="true">
              a<span>.</span>
            </span>
            <span className="wordmark-name">{profile.name[locale === 'fa' ? 'fa' : 'en']}</span>
          </Link>
          <nav className="desktop-nav" aria-label={t('label')}>
            {sections.map((id) => (
              <Link
                key={id}
                href={`/#${id}`}
                aria-current={isHome && active === id ? 'location' : undefined}
                onClick={(event) => navigateSection(event, id)}
              >
                {t(id)}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              href={pathname}
              locale={locale === 'en' ? 'fa' : 'en'}
              hrefLang={locale === 'en' ? 'fa' : 'en'}
              className="language-switch"
              aria-label={t('language')}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                setOpen(false);
                router.replace(`${pathname}${window.location.search}${window.location.hash}`, {
                  locale: locale === 'en' ? 'fa' : 'en',
                });
              }}
            >
              {locale === 'en' ? 'فا' : 'EN'}
            </Link>
            <Link className="header-cta" href="/#contact">
              {t('talk')}
              <ArrowUpRight size={15} className="directional" />
            </Link>
            <button
              ref={toggle}
              className="menu-toggle"
              aria-label={t(open ? 'close' : 'open')}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="mobile-panel" id="mobile-navigation" ref={menu}>
            <nav aria-label={t('label')}>
              {sections.map((id, i) => (
                <Link href={`/#${id}`} key={id} onClick={(event) => navigateSection(event, id)}>
                  <span className="mono">0{i + 1}</span>
                  {t(id)}
                  <ArrowUpRight className="directional" size={22} />
                </Link>
              ))}
            </nav>
            <button className="mobile-close" onClick={closeMenu}>
              {t('close')}
              <X size={16} />
            </button>
          </div>
        )}
      </header>
      {open && <div className="menu-scrim" aria-hidden="true" onClick={closeMenu} />}
    </>
  );
}

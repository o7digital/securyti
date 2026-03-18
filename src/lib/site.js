export const SITE_URL = 'https://securyti.mx';
export const SITE_NAME = 'SecuryTI';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/wp-content/uploads/2025/11/Securytiboy2-1.png`;

export const LOCALE_CONFIG = {
  es: {
    hrefLang: 'es',
    ogLocale: 'es_MX',
    prefix: '',
  },
  en: {
    hrefLang: 'en',
    ogLocale: 'en_US',
    prefix: '/en',
  },
  fr: {
    hrefLang: 'fr',
    ogLocale: 'fr_FR',
    prefix: '/fr',
  },
};

export const PAGE_METADATA = {
  '/': {
    pageType: 'home',
    titles: {
      es: 'SecuryTI | Ciberseguridad y consultoría en CDMX',
      en: 'SecuryTI | Cybersecurity and consulting in CDMX',
      fr: 'SecuryTI | Cybersécurité et conseil à CDMX',
    },
    descriptions: {
      es: 'Servicios de ciberseguridad empresarial en Mexico CDMX: auditorías de ciberseguridad, cumplimiento ISO 27001 y NIST, evaluación de riesgos y respuesta a incidentes.',
      en: 'Enterprise cybersecurity services in Mexico CDMX: cybersecurity audits, ISO 27001 and NIST compliance, risk assessment, and incident response.',
      fr: 'Services de cybersécurité pour entreprises à Mexico CDMX : audits de cybersécurité, conformité ISO 27001 et NIST, évaluation des risques et réponse aux incidents.',
    },
  },
  '/contacto/': {
    pageType: 'contact',
    titles: {
      es: 'Contacto de ciberseguridad en CDMX | SecuryTI',
      en: 'Cybersecurity Contact in CDMX | SecuryTI',
      fr: 'Contact cybersécurité à CDMX | SecuryTI',
    },
    descriptions: {
      es: 'Contacta a SecuryTI en Mexico CDMX para consultoría en seguridad de la información, auditorías de ciberseguridad y cumplimiento NIST.',
      en: 'Contact SecuryTI in Mexico CDMX for information security consulting, cybersecurity audits, and NIST compliance.',
      fr: 'Contactez SecuryTI à Mexico CDMX pour du conseil en sécurité de l’information, des audits de cybersécurité et la conformité NIST.',
    },
  },
  '/appointment/': {
    pageType: 'appointment',
    titles: {
      es: 'Agenda una cita de ciberseguridad en CDMX | SecuryTI',
      en: 'Book a Cybersecurity Appointment in CDMX | SecuryTI',
      fr: 'Prendre un rendez-vous cybersécurité à CDMX | SecuryTI',
    },
    descriptions: {
      es: 'Agenda una cita en Mexico CDMX para evaluar riesgos tecnológicos, pruebas de penetración y un plan de respuesta a incidentes para tu empresa.',
      en: 'Book an appointment in Mexico CDMX for technology risk assessment, penetration testing, and an incident response plan for your business.',
      fr: 'Prenez rendez-vous à Mexico CDMX pour l’évaluation des risques technologiques, les tests d’intrusion et un plan de réponse aux incidents pour votre entreprise.',
    },
  },
  '/acreditacion-nist/': {
    pageType: 'service',
    serviceTypes: {
      es: 'Cumplimiento NIST',
      en: 'NIST Compliance',
      fr: 'Conformité NIST',
    },
    titles: {
      es: 'Acreditación NIST en CDMX | SecuryTI',
      en: 'NIST Accreditation in CDMX | SecuryTI',
      fr: 'Accréditation NIST à CDMX | SecuryTI',
    },
    descriptions: {
      es: 'Acreditación NIST para empresas en Mexico CDMX: diagnóstico NIST CSF en 48 horas, evaluación de madurez y acompañamiento de cumplimiento.',
      en: 'NIST accreditation for businesses in Mexico CDMX: 48-hour NIST CSF assessment, maturity evaluation, and compliance guidance.',
      fr: 'Accréditation NIST pour entreprises à Mexico CDMX : diagnostic NIST CSF en 48 heures, évaluation de maturité et accompagnement de conformité.',
    },
  },
  '/aviso-de-privacidad/': {
    pageType: 'privacy',
    titles: {
      es: 'Aviso de Privacidad | SecuryTI',
      en: 'Privacy Notice | SecuryTI',
      fr: 'Politique de confidentialité | SecuryTI',
    },
    descriptions: {
      es: 'Aviso de privacidad de SecuryTI.',
      en: 'SecuryTI privacy notice.',
      fr: 'Politique de confidentialité de SecuryTI.',
    },
  },
};

export const PAGE_KEYS = Object.keys(PAGE_METADATA);

export function getRouteContext(route) {
  if (route === '/en/' || route.startsWith('/en/')) {
    return {
      locale: 'en',
      key: route.slice(3) || '/',
    };
  }

  if (route === '/fr/' || route.startsWith('/fr/')) {
    return {
      locale: 'fr',
      key: route.slice(3) || '/',
    };
  }

  return {
    locale: 'es',
    key: route,
  };
}

export function getLocalizedRoute(key, locale) {
  const { prefix } = LOCALE_CONFIG[locale];

  if (key === '/') {
    return prefix ? `${prefix}/` : '/';
  }

  return prefix ? `${prefix}${key}` : key;
}

export function toAbsoluteUrl(route) {
  return new URL(route === '/' ? '' : route.slice(1), `${SITE_URL}/`).toString();
}

export function getPageSeo(route) {
  const { key, locale } = getRouteContext(route);
  const metadata = PAGE_METADATA[key];

  if (!metadata) {
    throw new Error(`Unknown SEO route: ${route}`);
  }

  const canonicalUrl = toAbsoluteUrl(route);
  const alternates = Object.keys(LOCALE_CONFIG).map((targetLocale) => {
    const localizedRoute = getLocalizedRoute(key, targetLocale);

    return {
      hrefLang: LOCALE_CONFIG[targetLocale].hrefLang,
      locale: targetLocale,
      route: localizedRoute,
      url: toAbsoluteUrl(localizedRoute),
    };
  });

  return {
    ...metadata,
    key,
    locale,
    canonicalUrl,
    defaultUrl: toAbsoluteUrl(getLocalizedRoute(key, 'es')),
    description: metadata.descriptions[locale],
    ogImage: DEFAULT_OG_IMAGE,
    ogLocale: LOCALE_CONFIG[locale].ogLocale,
    alternates,
    title: metadata.titles[locale],
  };
}

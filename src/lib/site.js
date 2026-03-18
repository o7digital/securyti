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
      es: 'SecuryTI | Ciberseguridad y consultoría',
      en: 'SecuryTI | Cybersecurity and consulting',
      fr: 'SecuryTI | Cybersécurité et conseil',
    },
    descriptions: {
      es: 'Soluciones de ciberseguridad personalizadas para empresas: evaluación de riesgos, cumplimiento y respuesta a incidentes.',
      en: 'Tailored cybersecurity solutions for businesses: risk assessment, compliance, and incident response.',
      fr: 'Solutions de cybersécurité sur mesure pour les entreprises : évaluation des risques, conformité et réponse aux incidents.',
    },
  },
  '/contacto/': {
    pageType: 'contact',
    titles: {
      es: 'Contacto | SecuryTI',
      en: 'Contact | SecuryTI',
      fr: 'Contact | SecuryTI',
    },
    descriptions: {
      es: 'Contacta a SecuryTI para asesoría en ciberseguridad, auditorías y cumplimiento. Agenda una llamada con nuestro equipo.',
      en: 'Contact SecuryTI for cybersecurity advisory, audits, and compliance. Schedule a call with our team.',
      fr: 'Contactez SecuryTI pour des conseils en cybersécurité, des audits et la conformité. Planifiez un appel avec notre équipe.',
    },
  },
  '/appointment/': {
    pageType: 'appointment',
    titles: {
      es: 'Agenda una cita | SecuryTI',
      en: 'Book an Appointment | SecuryTI',
      fr: 'Prendre rendez-vous | SecuryTI',
    },
    descriptions: {
      es: 'Agenda una cita con SecuryTI para evaluar riesgos y definir un plan de ciberseguridad a la medida.',
      en: 'Book an appointment with SecuryTI to assess risks and define a tailored cybersecurity plan.',
      fr: 'Prenez rendez-vous avec SecuryTI pour évaluer les risques et définir un plan de cybersécurité sur mesure.',
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
      es: 'Acreditación NIST | SecuryTI',
      en: 'NIST Accreditation | SecuryTI',
      fr: 'Accréditation NIST | SecuryTI',
    },
    descriptions: {
      es: 'Acreditación NIST con SecuryTI: evaluación, implementación y acompañamiento para cumplir con marcos NIST.',
      en: 'NIST accreditation with SecuryTI: assessment, implementation, and guidance to meet NIST frameworks.',
      fr: 'Accréditation NIST avec SecuryTI : évaluation, mise en oeuvre et accompagnement pour répondre aux cadres NIST.',
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

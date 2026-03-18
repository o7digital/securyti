import { getLocalizedRoute, getRouteContext } from './site.js';

const CONTACT_EMAIL = 'contacto@securyti.mx';
const CONTACT_PHONE = '+52 1 55 6350 2870';
const OFFICE_ADDRESS = 'Montes Urales 755, Lomas-Virreyes, Lomas de Chapultepec';

const HOME_ROUTES = new Set(['/', '/en/', '/fr/']);
const APPOINTMENT_ROUTES = new Set(['/appointment/', '/en/appointment/', '/fr/appointment/']);
const CONTACT_ROUTES = new Set(['/contacto/', '/en/contacto/', '/fr/contacto/']);

const STRIP_RULES = [
  {
    matches: (route) => HOME_ROUTES.has(route),
    start: '<div class="elementor-element elementor-element-aa4eab9',
    end: '<div class="elementor-element elementor-element-65f5d2a',
  },
  {
    matches: (route) => HOME_ROUTES.has(route),
    start: '<div class="elementor-element elementor-element-80e1772',
    end: '<div class="elementor-element elementor-element-eafb74b',
  },
  {
    matches: (route) => APPOINTMENT_ROUTES.has(route),
    start: '<div class="elementor-element elementor-element-6bbc5c6',
    end: '<div class="elementor-element elementor-element-29abb48',
  },
  {
    matches: (route) => CONTACT_ROUTES.has(route),
    start: '<div class="elementor-element elementor-element-36d23f8',
    end: '<div class="elementor-element elementor-element-3fc4ba13',
  },
  {
    matches: () => true,
    start: '<div class="elementor-element elementor-element-46e03f64',
    end: '<div class="elementor-element elementor-element-5193070',
  },
];

const UNIVERSAL_REPLACEMENTS = [
  [/\bagarcia@security\.mx\b/gi, CONTACT_EMAIL],
  [/\bcontacto@security\.mx\b/gi, CONTACT_EMAIL],
  [/\bcontact@cyberguard\.com\b/gi, CONTACT_EMAIL],
  [/\+1 123 456 78/g, CONTACT_PHONE],
  [/\u00a0123 Cyber Street, Los Angeles, CA/g, OFFICE_ADDRESS],
  [/123 Cyber Street, Los Angeles, CA/g, OFFICE_ADDRESS],
];

const LOCALE_REPLACEMENTS = {
  es: [
    [/Contacta con nostros/g, 'Contacta con nosotros'],
    [/Office Location/g, 'Oficina'],
    [/Call Us Directly/g, 'Telefono'],
    [/Send a Message/g, 'Correo electronico'],
    [
      /Whether you have a question, a suggestion, or just want to say hello, this is the place to do it\. Please fill out the form below with your details and message, and we&#8217;ll get back to you as soon as possible\./g,
      'Comparte tu mensaje y nuestro equipo te respondera para orientarte en tu siguiente paso de ciberseguridad.',
    ],
    [/Prevention is cheaper than a breach/g, 'La prevencion cuesta menos que una brecha'],
    [/Politica de cookies/g, 'Politica de cookies'],
    [/Política de seguridad d el ainformación/g, 'Politica de seguridad de la informacion'],
    [/Servcios/g, 'Servicios'],
    [/\bCompliance\b/g, 'Cumplimiento'],
    [/Privacy Policy/g, 'Politica de privacidad'],
    [/Terms & Conditions/g, 'Terminos y condiciones'],
    [/Need 24\/7 Protection From Cyber Attacks\?/g, 'Necesitas proteccion continua frente a ciberataques?'],
    [/Start For Free/g, 'Agenda una cita'],
  ],
  en: [
    [/Contacta con nostros/g, 'Contact us'],
    [/Office Location/g, 'Office'],
    [/Call Us Directly/g, 'Phone'],
    [/Send a Message/g, 'Email'],
    [/Soluciones/g, 'Solutions'],
    [/Transparencia/g, 'Transparency'],
    [/CONTRATAR SERVICIOS/g, 'EXPLORE SERVICES'],
    [
      /Whether you have a question, a suggestion, or just want to say hello, this is the place to do it\. Please fill out the form below with your details and message, and we&#8217;ll get back to you as soon as possible\./g,
      'Share your needs with us and our team will reach out to guide your next cybersecurity step.',
    ],
    [/Prevention is cheaper than a breach/g, 'Prevention costs less than a breach'],
    [/Politica de cookies/g, 'Cookie policy'],
    [/Política de seguridad d el ainformación/g, 'Information security policy'],
    [/Servcios/g, 'Services'],
    [/Need 24\/7 Protection From Cyber Attacks\?/g, 'Need continuous protection from cyber threats?'],
    [/Start For Free/g, 'Book an appointment'],
  ],
  fr: [
    [/Contacta con nostros/g, 'Contactez-nous'],
    [/Office Location/g, 'Bureau'],
    [/Call Us Directly/g, 'Telephone'],
    [/Send a Message/g, 'Email'],
    [/Soluciones/g, 'Solutions'],
    [/Transparencia/g, 'Transparence'],
    [/Cybersecurity Experts/g, 'Experts en cybersécurité'],
    [/CONTRATAR SERVICIOS/g, 'DÉCOUVRIR NOS SERVICES'],
    [
      /Whether you have a question, a suggestion, or just want to say hello, this is the place to do it\. Please fill out the form below with your details and message, and we&#8217;ll get back to you as soon as possible\./g,
      'Partagez votre besoin et notre équipe vous contactera pour vous guider sur la suite de votre projet cybersécurité.',
    ],
    [/Prevention is cheaper than a breach/g, "La prévention coûte moins cher qu'une brèche"],
    [/Politica de cookies/g, 'Politique de cookies'],
    [/Política de seguridad d el ainformación/g, "Politique de sécurité de l'information"],
    [/Servcios/g, 'Services'],
    [/\bCompliance\b/g, 'Conformité'],
    [/Conformite/g, 'Conformité'],
    [/Privacy Policy/g, 'Politique de confidentialité'],
    [/Politique de confidentialite/g, 'Politique de confidentialité'],
    [/Terms & Conditions/g, 'Conditions generales'],
    [/Need 24\/7 Protection From Cyber Attacks\?/g, "Besoin d'une protection continue contre les cyberattaques ?"],
    [/Start For Free/g, 'Prendre rendez-vous'],
    [/Scroll to top/g, 'Haut de page'],
  ],
};

function stripBetween(html, startMarker, endMarker) {
  const startIndex = html.indexOf(startMarker);

  if (startIndex === -1) {
    return html;
  }

  const endIndex = html.indexOf(endMarker, startIndex);

  if (endIndex === -1) {
    return html;
  }

  return `${html.slice(0, startIndex)}${html.slice(endIndex)}`;
}

function applyReplacements(html, replacements) {
  return replacements.reduce(
    (currentHtml, [pattern, replacement]) => currentHtml.replace(pattern, replacement),
    html,
  );
}

function normalizeLinkText(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#038;|&amp;/gi, '&')
    .replace(/&#160;|&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function buildAnchor(attributes, innerHtml, href) {
  const cleanedAttributes = attributes.replace(/\s+/g, ' ').trim();
  const tokens = [];

  if (cleanedAttributes) {
    tokens.push(cleanedAttributes);
  }

  if (href) {
    tokens.push(`href="${href}"`);
  }

  return `<a${tokens.length ? ` ${tokens.join(' ')}` : ''}>${innerHtml}</a>`;
}

function escapeForwardSlashes(value) {
  return value.replace(/\//g, '\\/');
}

function includesAnyText(text, variants) {
  return variants.some((variant) => text.includes(variant));
}

function isLegacyBrokenHref(href) {
  return [
    /^(?:\.\.\/)?#$/i,
    /^(?:\.\.\/)?index\.html#$/i,
    /^(?:\.\.\/)?(?:contacto|appointment|acreditacion-nist)\/#$/i,
    /^(?:\.\.\/)?index\.html%3Fp=(?:25|29|2607)\.html#?$/i,
  ].some((pattern) => pattern.test(href));
}

function getLegacyMappedRoute(locale, href) {
  const routeMap = [
    [/^(?:\.\.\/)?index\.html%3Fp=25\.html#?$/i, '/contacto/'],
    [/^(?:\.\.\/)?index\.html%3Fp=29\.html#?$/i, '/appointment/'],
    [/^(?:\.\.\/)?index\.html%3Fp=2607\.html#?$/i, '/acreditacion-nist/'],
    [/^(?:\.\.\/)?contacto\/#$/i, '/contacto/'],
    [/^(?:\.\.\/)?appointment\/#$/i, '/appointment/'],
    [/^(?:\.\.\/)?acreditacion-nist\/#$/i, '/acreditacion-nist/'],
  ];

  const match = routeMap.find(([pattern]) => pattern.test(href));
  return match ? getLocalizedRoute(match[1], locale) : null;
}

function rewriteLegacyAbsoluteUrls(locale, html) {
  const homeRoute = getLocalizedRoute('/', locale);
  const appointmentRoute = getLocalizedRoute('/appointment/', locale);
  const escapedHomeRoute = escapeForwardSlashes(homeRoute);
  const escapedAppointmentRoute = escapeForwardSlashes(appointmentRoute);

  return html
    .replace(/https:\/\/onecode-media\.com\/securyti\/wp-content\//g, '/wp-content/')
    .replace(/https:\/\/onecode-media\.com\/securyti\/wp-includes\//g, '/wp-includes/')
    .replace(
      /https:\\\/\\\/onecode-media\.com\\\/securyti\\\/wp-content\\\//g,
      '\\/wp-content\\/',
    )
    .replace(
      /https:\\\/\\\/onecode-media\.com\\\/securyti\\\/wp-includes\\\//g,
      '\\/wp-includes\\/',
    )
    .replace(/https:\/\/onecode-media\.com\/securyti\/appointment\//g, appointmentRoute)
    .replace(
      /https:\\\/\\\/onecode-media\.com\\\/securyti\\\/appointment\\\//g,
      escapedAppointmentRoute,
    )
    .replace(/https:\/\/onecode-media\.com\/securyti\//g, homeRoute)
    .replace(/https:\\\/\\\/onecode-media\.com\\\/securyti\\\//g, escapedHomeRoute);
}

function resolveAnchorHref(locale, href, attributes, text) {
  const privacyRoute = getLocalizedRoute('/aviso-de-privacidad/', locale);
  const contactRoute = getLocalizedRoute('/contacto/', locale);
  const appointmentRoute = getLocalizedRoute('/appointment/', locale);
  const nistRoute = getLocalizedRoute('/acreditacion-nist/', locale);
  const consultingRoute = '/consultoria-tecnologica/';
  const trainingRoute = '/formacion-en-ciberseguridad/';
  const expertRoute = '/peritajes-e-informes-periciales/';

  if (attributes.includes('pxl-scroll-top-link')) {
    return '#page-top';
  }

  if (
    includesAnyText(text, [
      'politica de privacidad',
      'privacy policy',
      'politique de confidentialite',
      'politica de cookies',
      'cookie policy',
      'politique de cookies',
    ])
  ) {
    return privacyRoute;
  }

  if (
    includesAnyText(text, [
      'terms & conditions',
      'terms and conditions',
      'condiciones de uso',
      'terminos y condiciones',
      'conditions generales',
    ])
  ) {
    return null;
  }

  const legacyMappedRoute = getLegacyMappedRoute(locale, href);

  if (legacyMappedRoute === appointmentRoute) {
    return appointmentRoute;
  }

  if (
    legacyMappedRoute === nistRoute ||
    includesAnyText(text, [
      'cumplimiento',
      'compliance',
      'conformite',
      'certificaciones',
      'certification',
    ])
  ) {
    return nistRoute;
  }

  if (locale === 'es' && text.includes('consultoria tecnologica')) {
    return consultingRoute;
  }

  if (locale === 'es' && text.includes('formacion en ciberseguridad')) {
    return trainingRoute;
  }

  if (locale === 'es' && text.includes('peritajes e informes periciales')) {
    return expertRoute;
  }

  if (
    legacyMappedRoute === contactRoute ||
    attributes.includes('elementor-item') ||
    attributes.includes('elementor-sub-item') ||
    attributes.includes('btn pxl-icon-active btn-default') ||
    text.includes('soluciones') ||
    text.includes('solutions')
  ) {
    return contactRoute;
  }

  if (
    text.includes('auditoria') ||
    text.includes('consultoria') ||
    text.includes('consulting') ||
    text.includes('conseil') ||
    text.includes('training') ||
    text.includes('formacion') ||
    text.includes('formation') ||
    text.includes('peritaje') ||
    text.includes('forensics') ||
    text.includes("expertise") ||
    text.includes('security information') ||
    text.includes('seguridad de la informacion')
  ) {
    return contactRoute;
  }

  return null;
}

function rewriteBrokenHashLinks(locale, html) {
  return html.replace(
    /<a\b([^>]*)href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, beforeAttributes = '', href = '', afterAttributes = '', innerHtml = '') => {
      if (!isLegacyBrokenHref(href)) {
        return match;
      }

      const attributes = `${beforeAttributes} ${afterAttributes}`.trim();
      const text = normalizeLinkText(innerHtml);
      const resolvedHref = resolveAnchorHref(locale, href, attributes, text);

      return buildAnchor(attributes, innerHtml, resolvedHref);
    },
  );
}

function stripTermsPlaceholders(html) {
  return html
    .replace(
      /<div class="pxl--item "\s+data-wow-delay="ms">\s*<a\b[\s\S]*?<span>(?:Condiciones de uso|Terminos y condiciones|Conditions generales)<\/span>[\s\S]*?<\/a>\s*<\/div>/gi,
      '',
    )
    .replace(
      /<p>\s*<a(?:\s+[^>]*)?>\s*(?:Terms(?:\s|&amp;)+Conditions|Terminos y condiciones|Conditions generales)\s*<\/a>\s*<\/p>/gi,
      '',
    )
    .replace(
      /<div class="elementor-element [^"]*elementor-widget elementor-widget-pxl_text_editor"[^>]*>\s*<div class="elementor-widget-container">\s*<div id="pxl_text_editor-[^"]+" class="pxl-image-wg" duration="1">\s*<div class="pxl-text-editor">\s*<div class="pxl-item--inner "\s+data-wow-delay="ms">\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gi,
      '',
    );
}

function stripLegacyLangSwitch(html) {
  return html
    .replace(/<style>\s*#lang-switch[\s\S]*?<\/style>\s*/gi, '')
    .replace(/<div id="lang-switch">[\s\S]*?<\/div>\s*/gi, '');
}

export function cleanupMirrorBodyHtml(route, html) {
  const { locale } = getRouteContext(route);

  let cleanedHtml = html;

  for (const rule of STRIP_RULES) {
    if (rule.matches(route)) {
      cleanedHtml = stripBetween(cleanedHtml, rule.start, rule.end);
    }
  }

  cleanedHtml = applyReplacements(cleanedHtml, UNIVERSAL_REPLACEMENTS);
  cleanedHtml = applyReplacements(cleanedHtml, LOCALE_REPLACEMENTS[locale] ?? []);
  cleanedHtml = rewriteLegacyAbsoluteUrls(locale, cleanedHtml);
  cleanedHtml = rewriteBrokenHashLinks(locale, cleanedHtml);
  cleanedHtml = stripTermsPlaceholders(cleanedHtml);
  cleanedHtml = stripLegacyLangSwitch(cleanedHtml);

  return cleanedHtml;
}

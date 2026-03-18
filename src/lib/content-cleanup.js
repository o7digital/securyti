import { getRouteContext } from './site.js';

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
    [
      /Whether you have a question, a suggestion, or just want to say hello, this is the place to do it\. Please fill out the form below with your details and message, and we&#8217;ll get back to you as soon as possible\./g,
      'Partagez votre besoin et notre equipe vous contactera pour vous guider sur la suite de votre projet cybersecurite.',
    ],
    [/Prevention is cheaper than a breach/g, 'La prevention coute moins cher qu une breche'],
    [/Politica de cookies/g, 'Politique de cookies'],
    [/Política de seguridad d el ainformación/g, "Politique de securite de l'information"],
    [/Servcios/g, 'Services'],
    [/\bCompliance\b/g, 'Conformite'],
    [/Privacy Policy/g, 'Politique de confidentialite'],
    [/Terms & Conditions/g, 'Conditions generales'],
    [/Need 24\/7 Protection From Cyber Attacks\?/g, 'Besoin d une protection continue contre les cyberattaques ?'],
    [/Start For Free/g, 'Prendre rendez-vous'],
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

  return cleanedHtml;
}

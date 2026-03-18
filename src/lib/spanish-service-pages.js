import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './site.js';

export const SPANISH_SERVICE_PAGES = {
  '/consultoria-tecnologica/': {
    route: '/consultoria-tecnologica/',
    serviceType: 'Consultoría tecnológica en ciberseguridad',
    title: 'Consultoría tecnológica en ciberseguridad en CDMX | SecuryTI',
    description:
      'Consultoría tecnológica en ciberseguridad para empresas en CDMX: arquitectura, gobierno técnico, hardening y decisiones de seguridad alineadas al negocio.',
    heroTitle: 'Consultoría tecnológica en ciberseguridad para empresas en CDMX',
    summary:
      'Acompañamos decisiones técnicas críticas para que tu infraestructura, nube, accesos y operación evolucionen con controles sólidos, criterio de riesgo y visión de negocio.',
    intro:
      'SecuryTI ayuda a organizaciones en CDMX y México a traducir objetivos de seguridad en decisiones técnicas concretas. Diseñamos hojas de ruta, validamos controles, evaluamos proveedores y reducimos deuda técnica con foco en resiliencia operativa.',
    problemsTitle: 'Cuándo conviene este servicio',
    problems: [
      'Cuando la empresa crece más rápido que su arquitectura de seguridad.',
      'Cuando hay migraciones a nube, nuevas sedes o integración de terceros sin criterios técnicos homogéneos.',
      'Cuando dirección y TI necesitan priorizar inversiones con evidencia, impacto y orden.',
    ],
    processTitle: 'Cómo trabajamos',
    process: [
      {
        title: '1. Diagnóstico técnico',
        body: 'Levantamos alcance, activos críticos, dependencias, stack actual y principales riesgos operativos.',
      },
      {
        title: '2. Diseño y validación',
        body: 'Definimos arquitectura objetivo, segmentación, controles, prioridades y criterios de gobierno técnico.',
      },
      {
        title: '3. Roadmap accionable',
        body: 'Entregamos un plan de evolución con quick wins, acciones estructurales, responsables y dependencias.',
      },
    ],
    deliverablesTitle: 'Entregables',
    deliverables: [
      'Diagnóstico de postura tecnológica y riesgos prioritarios.',
      'Arquitectura objetivo y recomendaciones de seguridad por dominio.',
      'Roadmap de implementación con prioridades, responsables y esfuerzo estimado.',
    ],
    faq: [
      {
        question: '¿La consultoría tecnológica sustituye al equipo interno?',
        answer:
          'No. El objetivo es acelerar decisiones y reforzar capacidades del equipo interno con una visión externa y especializada.',
      },
      {
        question: '¿Se puede aplicar si ya tenemos proveedores de TI?',
        answer:
          'Sí. Podemos evaluar el esquema actual, ordenar responsabilidades y definir controles para trabajar mejor con proveedores, nube y operación interna.',
      },
      {
        question: '¿Incluye apoyo para dirección y comité?',
        answer:
          'Sí. Traducimos hallazgos técnicos en recomendaciones ejecutivas para facilitar priorización, presupuesto y seguimiento.',
      },
    ],
    relatedRoutes: ['/formacion-en-ciberseguridad/', '/peritajes-e-informes-periciales/'],
  },
  '/formacion-en-ciberseguridad/': {
    route: '/formacion-en-ciberseguridad/',
    serviceType: 'Formación en ciberseguridad',
    title: 'Formación en ciberseguridad para equipos en CDMX | SecuryTI',
    description:
      'Formación en ciberseguridad para equipos en CDMX: concienciación, hábitos seguros, simulaciones y capacitación adaptada al riesgo real de la empresa.',
    heroTitle: 'Formación en ciberseguridad para equipos y liderazgo en CDMX',
    summary:
      'Diseñamos programas de capacitación para reducir errores humanos, elevar madurez operativa y convertir la seguridad en una práctica cotidiana del negocio.',
    intro:
      'Un programa de ciberseguridad no se sostiene solo con tecnología. En SecuryTI entrenamos a usuarios, líderes y equipos operativos para mejorar hábitos, entender amenazas reales y responder con criterio ante intentos de fraude, fuga de información o abuso de accesos.',
    problemsTitle: 'Qué ayudamos a corregir',
    problems: [
      'Bajo nivel de concienciación frente a phishing, ingeniería social y manejo de información sensible.',
      'Procesos internos poco claros para escalar incidentes o actuar ante comportamientos anómalos.',
      'Equipos con distintas responsabilidades que requieren capacitación específica y no genérica.',
    ],
    processTitle: 'Modelo de trabajo',
    process: [
      {
        title: '1. Perfil de riesgo',
        body: 'Identificamos audiencias, escenarios críticos y comportamientos que deben reforzarse en cada área.',
      },
      {
        title: '2. Capacitación dirigida',
        body: 'Construimos sesiones prácticas para usuarios, mandos medios y liderazgo con ejemplos del entorno real.',
      },
      {
        title: '3. Seguimiento y mejora',
        body: 'Medimos adopción, resolvemos dudas y ajustamos contenidos para sostener cambios de hábito.',
      },
    ],
    deliverablesTitle: 'Entregables',
    deliverables: [
      'Programa formativo adaptado a áreas, perfiles y nivel de exposición.',
      'Material práctico para reforzar hábitos seguros y toma de decisiones.',
      'Sesiones, guías y recomendaciones de continuidad para el equipo.',
    ],
    faq: [
      {
        question: '¿La formación es solo para usuarios finales?',
        answer:
          'No. Puede incluir liderazgo, áreas administrativas, TI y perfiles con privilegios elevados, cada uno con contenidos distintos.',
      },
      {
        question: '¿Se puede personalizar por industria o tipo de empresa?',
        answer:
          'Sí. Ajustamos ejemplos, lenguaje y escenarios a la realidad operativa de cada organización en CDMX o en otras sedes del país.',
      },
      {
        question: '¿Sirve aunque ya tengamos políticas internas?',
        answer:
          'Sí. La capacitación convierte políticas en hábitos comprensibles y ejecutables por las personas que realmente las deben aplicar.',
      },
    ],
    relatedRoutes: ['/consultoria-tecnologica/', '/peritajes-e-informes-periciales/'],
  },
  '/peritajes-e-informes-periciales/': {
    route: '/peritajes-e-informes-periciales/',
    serviceType: 'Peritajes e informes periciales informáticos',
    title: 'Peritajes e informes periciales informáticos en CDMX | SecuryTI',
    description:
      'Peritajes e informes periciales informáticos en CDMX: análisis técnico, preservación de evidencia y documentación clara para procesos internos o legales.',
    heroTitle: 'Peritajes e informes periciales informáticos en CDMX',
    summary:
      'Analizamos evidencia digital, reconstruimos hechos y documentamos hallazgos con rigor técnico para que la organización pueda sustentar decisiones, reclamaciones o procesos formales.',
    intro:
      'Cuando existe un incidente, fraude, acceso no autorizado o disputa técnica, la evidencia debe tratarse con método. SecuryTI realiza peritajes e informes periciales informáticos con trazabilidad, claridad documental y enfoque práctico para dirección, legal y áreas técnicas.',
    problemsTitle: 'Escenarios comunes',
    problems: [
      'Necesidad de preservar evidencia digital sin comprometer su integridad.',
      'Incidentes internos o externos que requieren reconstrucción cronológica y análisis técnico.',
      'Procesos formales donde la empresa necesita un informe claro, entendible y sustentado.',
    ],
    processTitle: 'Fases del peritaje',
    process: [
      {
        title: '1. Aseguramiento de evidencia',
        body: 'Definimos alcance, custodias, fuentes de información y medidas para conservar integridad y trazabilidad.',
      },
      {
        title: '2. Análisis técnico',
        body: 'Revisamos logs, accesos, artefactos y contexto operativo para reconstruir hechos y validar hipótesis.',
      },
      {
        title: '3. Informe pericial',
        body: 'Documentamos metodología, hallazgos, evidencias y conclusiones con lenguaje útil para áreas técnicas y de decisión.',
      },
    ],
    deliverablesTitle: 'Entregables',
    deliverables: [
      'Informe técnico con hallazgos, evidencia y cronología.',
      'Conclusiones periciales con enfoque claro para dirección, legal o auditoría interna.',
      'Recomendaciones para corrección, contención y fortalecimiento posterior.',
    ],
    faq: [
      {
        question: '¿El servicio aplica solo en litigios?',
        answer:
          'No. También es útil para investigaciones internas, incidentes con terceros, fraude, accesos indebidos o validación de hechos técnicos.',
      },
      {
        question: '¿Qué tan importante es actuar rápido?',
        answer:
          'Mucho. Mientras más pronto se preserve la evidencia, mayor probabilidad hay de reconstruir correctamente los hechos y evitar pérdida de información crítica.',
      },
      {
        question: '¿El informe puede ser entendido por personas no técnicas?',
        answer:
          'Sí. Estructuramos el informe para que tenga valor técnico y también sirva como insumo para dirección, legal o áreas de control.',
      },
    ],
    relatedRoutes: ['/consultoria-tecnologica/', '/formacion-en-ciberseguridad/'],
  },
};

export const SPANISH_SERVICE_ROUTES = Object.keys(SPANISH_SERVICE_PAGES);

export function getSpanishServicePage(route) {
  const page = SPANISH_SERVICE_PAGES[route];

  if (!page) {
    return null;
  }

  const canonicalUrl = new URL(route.slice(1), `${SITE_URL}/`).toString();

  return {
    ...page,
    canonicalUrl,
    ogImage: DEFAULT_OG_IMAGE,
    siteName: SITE_NAME,
    homeHref: '/',
    contactHref: '/contacto/',
    appointmentHref: '/appointment/',
    relatedPages: page.relatedRoutes.map((relatedRoute) => {
      const related = SPANISH_SERVICE_PAGES[relatedRoute];

      return {
        href: relatedRoute,
        title: related.heroTitle,
      };
    }),
  };
}

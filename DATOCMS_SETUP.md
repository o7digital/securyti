# DatoCMS setup (branche `dev`)

## 1) Variables d'environnement

Copie `.env.example` vers `.env` puis renseigne:

- `DATOCMS_API_TOKEN`: token API read-only DatoCMS
- `DATOCMS_ENVIRONMENT`: environnement Dato (souvent `main`)
- `DATOCMS_API_URL`: garder `https://graphql.datocms.com/` sauf besoin spécifique

## 2) Client DatoCMS

Le client est prêt dans `src/lib/datocms.js` avec:

- `getDatoCmsConfig()`: lecture de la config
- `datoCmsRequest(query, variables)`: requêtes GraphQL sécurisées
- `fetchDatoCmsSiteInfo()`: requête de test simple

## 3) Exemple d'utilisation dans une page Astro

```astro
---
import { datoCmsRequest } from '../lib/datocms.js';

const data = await datoCmsRequest(`
  query HomePage {
    allHomepages(first: 1) {
      title
    }
  }
`);

const homepage = data?.allHomepages?.[0];
---

<h1>{homepage?.title}</h1>
```

## 4) Prochaine étape

Quand ton modèle DatoCMS est prêt (collections/champs), on branche les pages du site une par une en remplaçant le contenu mirror par les requêtes DatoCMS.

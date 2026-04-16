const DEFAULT_DATOCMS_API_URL = 'https://graphql.datocms.com/';

export function getDatoCmsConfig() {
  const apiToken = import.meta.env.DATOCMS_API_TOKEN;
  const environment = import.meta.env.DATOCMS_ENVIRONMENT || 'main';
  const apiUrl = import.meta.env.DATOCMS_API_URL || DEFAULT_DATOCMS_API_URL;

  return {
    apiToken,
    apiUrl,
    environment,
    isConfigured: Boolean(apiToken),
  };
}

export async function datoCmsRequest(query, variables = {}) {
  const { apiToken, apiUrl, environment, isConfigured } = getDatoCmsConfig();

  if (!isConfigured) {
    throw new Error('DatoCMS is not configured. Set DATOCMS_API_TOKEN in your environment.');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Environment': environment,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DatoCMS request failed (${response.status}): ${body}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    const message = payload.errors.map((err) => err.message).join('; ');
    throw new Error(`DatoCMS GraphQL error: ${message}`);
  }

  return payload.data;
}

export async function fetchDatoCmsSiteInfo() {
  const query = `
    query SiteInfo {
      _site {
        name
      }
    }
  `;

  const data = await datoCmsRequest(query);
  return data?._site || null;
}

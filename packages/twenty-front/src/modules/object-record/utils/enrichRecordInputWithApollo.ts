import { REST_API_BASE_URL } from '@/apollo/constant/rest-api-base-url';
import { getTokenPair } from '@/apollo/utils/getTokenPair';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';

export const enrichRecordInputWithApollo = async ({
  objectNameSingular,
  recordInput,
}: {
  objectNameSingular: string;
  recordInput: Record<string, any>;
}): Promise<Record<string, any> | null> => {
  const normalizedObjectName =
    objectNameSingular.toLowerCase() as CoreObjectNameSingular;

  const hasCompanyDomain =
    normalizedObjectName === CoreObjectNameSingular.Company &&
    Boolean(
      recordInput?.domainName?.primaryLinkUrl ??
        recordInput?.domain ??
        recordInput?.website,
    );

  if (
    normalizedObjectName === CoreObjectNameSingular.Company &&
    hasCompanyDomain === false
  ) {
    // eslint-disable-next-line no-console
    console.log(
      '[ApolloEnrich] skip: company enrichment requires domain/website',
      recordInput,
    );
    return null;
  }

  // Temporary debug logs to understand why enrichment may not run
  // eslint-disable-next-line no-console
  console.log('[ApolloEnrich] called with', {
    objectNameSingular: normalizedObjectName,
    recordInput,
  });
  // eslint-disable-next-line no-console
  console.log('[ApolloEnrich] payload snapshot', JSON.stringify(recordInput));

  const token =
    getTokenPair()?.accessOrWorkspaceAgnosticToken?.token ?? null;

  try {
    // eslint-disable-next-line no-console
    console.log(
      '[ApolloEnrich] sending request to',
      `${REST_API_BASE_URL}/integrations/apollo/enrich`,
    );
    const response = await fetch(
      `${REST_API_BASE_URL}/integrations/apollo/enrich`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          objectNameSingular: normalizedObjectName,
          recordInput,
        }),
      },
    );

    // eslint-disable-next-line no-console
    console.log('[ApolloEnrich] response status', response.status);

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.log('[ApolloEnrich] response not ok', response.status);
      return null;
    }

    const data = (await response.json()) as {
      enrichment?: Record<string, any>;
    };

    // eslint-disable-next-line no-console
    console.log('[ApolloEnrich] response body', data);

    return data?.enrichment ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[ApolloEnrich] fetch error', error);
    return null;
  }
};

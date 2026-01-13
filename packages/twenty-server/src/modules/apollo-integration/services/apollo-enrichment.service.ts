import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { isDefined } from 'twenty-shared/utils';

const PERSON_OBJECT_NAME = 'person';
const COMPANY_OBJECT_NAME = 'company';

@Injectable()
export class ApolloEnrichmentService {
  private readonly logger = new Logger(ApolloEnrichmentService.name);
  private readonly apiKey = process.env.APOLLO_ENRICHMENT_API_KEY ?? '';

  constructor(private readonly httpService: HttpService) {}

  async enrich(
    objectNameSingular: string,
    recordInput: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const normalizedObjectName = objectNameSingular.toLowerCase();

    this.logger.log(
      `Received Apollo enrichment request for object="${normalizedObjectName}"`,
    );

    if (!this.apiKey) {
      this.logger.warn(
        'Apollo enrichment API key is not configured. Continuing request for debugging purposes.',
      );
    }

    if (normalizedObjectName === PERSON_OBJECT_NAME) {
      return this.enrichPerson(recordInput);
    }

    if (normalizedObjectName === COMPANY_OBJECT_NAME) {
      return this.enrichCompany(recordInput);
    }

    this.logger.debug(
      `Apollo enrichment not supported for object="${normalizedObjectName}", skipping.`,
    );

    return null;
  }

  private async enrichPerson(
    recordInput: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const payload = this.removeEmptyValues({
      email: this.extractPrimaryEmail(recordInput),
      first_name: recordInput?.name?.firstName ?? recordInput?.firstName,
      last_name: recordInput?.name?.lastName ?? recordInput?.lastName,
      organization_name:
        recordInput?.company?.name ??
        recordInput?.companyName ??
        recordInput?.organizationName,
      domain: this.extractDomain(
        recordInput?.company?.domainName?.primaryLinkUrl ??
          recordInput?.domainName?.primaryLinkUrl ??
          recordInput?.domain ??
          recordInput?.website,
      ),
    });

    const response = await this.postApollo<any>('/people/match', payload);

    const person =
      response?.person ?? response?.match ?? response?.prospect ?? response;

    return this.mapPersonResponse(person);
  }

  private async enrichCompany(
    recordInput: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const domain = this.extractDomain(
      recordInput?.domainName?.primaryLinkUrl ??
        recordInput?.domain ??
        recordInput?.website,
    );

    if (!domain) {
      this.logger.warn(
        'Apollo enrichment skipped for company: no domain found on record input.',
      );
      return null;
    }

    // For company enrichment, Apollo works reliably with `domain` only,
    // which matches the smoke-test script. Sending only domain also reduces
    // chances of 422 due to unsupported identifier combinations.
    const payload = { domain };

    const response = await this.postApollo<any>(
      '/organizations/enrich',
      payload,
    );

    const organization =
      response?.organization ??
      response?.organization_enrichment ??
      response?.company ??
      response;

    return this.mapOrganizationResponse(organization);
  }

  private async postApollo<T>(
    endpoint: string,
    payload: Record<string, any>,
  ): Promise<T | null> {
    const finalPayload = this.removeEmptyValues(payload);
    this.logger.debug(
      `Calling Apollo endpoint="${endpoint}" with payload keys=${Object.keys(finalPayload).join(',')}`,
    );

    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(endpoint, finalPayload, {
          timeout: 10_000,
          headers: {
            'X-Api-Key': this.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      const err = error as any;

      const status = err?.response?.status;
      const statusText = err?.response?.statusText;
      const responseData = err?.response?.data;

      this.logger.warn(
        `Apollo enrichment request failed for ${endpoint}${
          status ? ` with status ${status} ${statusText ?? ''}` : ''
        }`,
        err?.message,
      );

      if (responseData) {
        this.logger.debug(
          `Apollo enrichment error response for ${endpoint}: ${JSON.stringify(responseData)}`,
        );
      }

      return null;
    }
  }

  private mapPersonResponse(
    person: Record<string, any> | undefined,
  ): Record<string, any> | null {
    if (!isDefined(person)) {
      return null;
    }

    const enrichment: Record<string, any> = {};

    const firstName =
      person?.first_name ??
      person?.firstName ??
      person?.name?.first ??
      person?.name?.first_name;
    const lastName =
      person?.last_name ??
      person?.lastName ??
      person?.name?.last ??
      person?.name?.last_name;

    if (firstName || lastName) {
      enrichment.name = {
        firstName: firstName ?? '',
        lastName: lastName ?? '',
      };
    }

    const email =
      person?.email ??
      person?.emails?.[0]?.value ??
      person?.emails?.[0]?.email ??
      person?.contact?.emails?.[0];

    if (email) {
      enrichment.emails = {
        primaryEmail: email,
        additionalEmails: null,
      };
    }

    if (person?.title ?? person?.employment_title ?? person?.headline) {
      enrichment.jobTitle =
        person?.title ?? person?.employment_title ?? person?.headline;
    }

    if (person?.city ?? person?.location_city ?? person?.home_city) {
      enrichment.city =
        person?.city ?? person?.location_city ?? person?.home_city;
    }

    const linkedinUrl =
      person?.linkedin_url ??
      person?.linkedin ??
      person?.linkedin_profile_url;
    if (linkedinUrl) {
      enrichment.linkedinLink = this.buildLink(linkedinUrl, 'LinkedIn');
    }

    const twitterUrl =
      person?.twitter_url ?? person?.twitter ?? person?.x_url ?? person?.x;
    if (twitterUrl) {
      enrichment.xLink = this.buildLink(twitterUrl, 'X');
    }

    const avatarUrl = person?.photo_url ?? person?.avatar_url;
    if (avatarUrl) {
      enrichment.avatarUrl = avatarUrl;
    }

    return Object.keys(enrichment).length > 0 ? enrichment : null;
  }

  private mapOrganizationResponse(
    organization: Record<string, any> | undefined,
  ): Record<string, any> | null {
    if (!isDefined(organization)) {
      return null;
    }

    const enrichment: Record<string, any> = {};

    if (organization?.name) {
      enrichment.name = organization.name;
    }

    const website =
      organization?.website_url ?? organization?.website ?? organization?.domain;
    if (website) {
      enrichment.domainName = this.buildLink(website, 'Website');
    }

    const linkedinUrl =
      organization?.linkedin_url ?? organization?.linkedin;
    if (linkedinUrl) {
      enrichment.linkedinLink = this.buildLink(linkedinUrl, 'LinkedIn');
    }

    const twitterUrl =
      organization?.twitter_url ?? organization?.twitter ?? organization?.x_url;
    if (twitterUrl) {
      enrichment.xLink = this.buildLink(twitterUrl, 'X');
    }

    if (organization?.estimated_num_employees) {
      enrichment.employees = organization.estimated_num_employees;
    }

    const addressFields = {
      addressStreet1:
        organization?.street_address ??
        organization?.address?.street_address ??
        organization?.headquarters_street_address,
      addressStreet2:
        organization?.address?.street_address_2 ??
        organization?.headquarters_street_address_2,
      addressCity:
        organization?.city ?? organization?.address?.city ?? organization?.hq_city,
      addressState:
        organization?.state ?? organization?.address?.state ?? organization?.hq_state,
      addressCountry:
        organization?.country ??
        organization?.address?.country ??
        organization?.hq_country,
      addressPostcode:
        organization?.postal_code ??
        organization?.address?.postal_code ??
        organization?.hq_postal_code,
      addressLat: organization?.address?.lat ?? null,
      addressLng: organization?.address?.lng ?? null,
    };

    if (Object.values(addressFields).some(isDefined)) {
      enrichment.address = {
        addressStreet1: addressFields.addressStreet1 ?? '',
        addressStreet2: addressFields.addressStreet2 ?? '',
        addressCity: addressFields.addressCity ?? '',
        addressState: addressFields.addressState ?? '',
        addressCountry: addressFields.addressCountry ?? '',
        addressPostcode: addressFields.addressPostcode ?? '',
        addressLat: addressFields.addressLat,
        addressLng: addressFields.addressLng,
      };
    }

    return Object.keys(enrichment).length > 0 ? enrichment : null;
  }

  private buildLink(url: string, label: string) {
    if (!url) {
      return undefined;
    }

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    return {
      primaryLinkUrl: formattedUrl,
      primaryLinkLabel: label,
      secondaryLinks: [],
    };
  }

  private extractPrimaryEmail(recordInput: Record<string, any>) {
    return (
      recordInput?.emails?.primaryEmail ??
      recordInput?.email ??
      recordInput?.primaryEmail
    );
  }

  private extractDomain(url?: string | null) {
    if (!url) {
      return undefined;
    }

    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlInstance = new URL(normalizedUrl);

      return urlInstance.hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    }
  }

  private removeEmptyValues(payload: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }

        return value !== undefined && value !== null && value !== '';
      }),
    );
  }

  private hasIdentifiers(
    payload: Record<string, any>,
    keys: string[],
  ): boolean {
    return keys.some((key) => isDefined(payload[key]));
  }
}

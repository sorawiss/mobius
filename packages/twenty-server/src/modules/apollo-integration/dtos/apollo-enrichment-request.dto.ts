import { IsObject, IsString } from 'class-validator';

export class ApolloEnrichmentRequestDto {
  @IsString()
  objectNameSingular: string;

  @IsObject()
  recordInput: Record<string, any>;
}

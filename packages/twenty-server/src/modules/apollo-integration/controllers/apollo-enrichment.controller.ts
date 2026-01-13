import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

import { ApolloEnrichmentRequestDto } from '../dtos/apollo-enrichment-request.dto';
import { ApolloEnrichmentService } from '../services/apollo-enrichment.service';

@Controller('rest/integrations/apollo')
@UseGuards(JwtAuthGuard, WorkspaceAuthGuard)
export class ApolloEnrichmentController {
  private readonly logger = new Logger(ApolloEnrichmentController.name);

  constructor(
    private readonly apolloEnrichmentService: ApolloEnrichmentService,
  ) {}

  @Post('enrich')
  async enrich(
    @Body() { objectNameSingular, recordInput }: ApolloEnrichmentRequestDto,
  ) {
    this.logger.log(
      `Received REST request for Apollo enrichment object="${objectNameSingular}" with keys=${Object.keys(recordInput ?? {}).join(',')}`,
    );
    const enrichment = await this.apolloEnrichmentService.enrich(
      objectNameSingular,
      recordInput,
    );
    this.logger.log(
      `Apollo enrichment resolved for object="${objectNameSingular}" result=${enrichment ? 'found' : 'null'}`,
    );

    return {
      enrichment,
    };
  }
}

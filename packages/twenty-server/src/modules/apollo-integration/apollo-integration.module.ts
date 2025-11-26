import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';

import { ApolloEnrichmentController } from './controllers/apollo-enrichment.controller';
import { ApolloEnrichmentService } from './services/apollo-enrichment.service';

@Module({
  imports: [
    AuthModule,
    WorkspaceCacheStorageModule,
    HttpModule.register({
      baseURL:
        process.env.APOLLO_ENRICHMENT_BASE_URL ?? 'https://api.apollo.io/v1',
      timeout: 10_000,
    }),
  ],
  controllers: [ApolloEnrichmentController],
  providers: [ApolloEnrichmentService],
  exports: [ApolloEnrichmentService],
})
export class ApolloIntegrationModule {}

import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AutosearchService } from '../autosearch.service';

@Resolver('Autosearch')
export class AutosearchResolver {
  constructor(private readonly autosearchService: AutosearchService) {}

  @Mutation('addProductToAutoSearch')
  async addProductToAutoSearch(@Args('url') productUrl: string) {
    return await this.autosearchService.addProductToAutoSearch(productUrl);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AutosearchResolver } from './gql/autosearch.resolver';
import { AutosearchService } from './autosearch.service';

describe('AutosearchResolver', () => {
  let resolver: AutosearchResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutosearchResolver, AutosearchService],
    }).compile();

    resolver = module.get<AutosearchResolver>(AutosearchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

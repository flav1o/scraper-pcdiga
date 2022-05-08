import { Test, TestingModule } from '@nestjs/testing';
import { AutosearchService } from './autosearch.service';

describe('AutosearchService', () => {
  let service: AutosearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutosearchService],
    }).compile();

    service = module.get<AutosearchService>(AutosearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

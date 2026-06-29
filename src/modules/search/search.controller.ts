import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':collection/:term')
  async search(
    @Param('collection') collection: string,
    @Param('term') term: string,
  ) {
    const result = await this.searchService.search(collection, term);

    return {
      results: result,
    };
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Controller('tokens')
export class TokensController {
  constructor(
    @Inject(TokensService) private readonly tokensService: TokensService
  ) {
    // //     console.log('>>> TokensController CONSTRUCTOR: this.tokensService IS', this.tokensService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post()
  create(@Body() createTokenDto: CreateTokenDto) {
    //     console.log('>>> TokensController: POST /tokens', createTokenDto);
    return this.tokensService.create(createTokenDto);
  }

  @Get()
  findAll() {
    //     console.log('>>> TokensController: GET /tokens');
    return this.tokensService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    //     console.log('>>> TokensController: GET /tokens/user/:userId', userId);
    return this.tokensService.findByUserId(userId);
  }

  @Get('user/:userId/balance')
  getUserTokenBalance(
    @Param('userId') userId: string,
    @Query('type') tokenType?: string
  ) {
    //     console.log('>>> TokensController: GET /tokens/user/:userId/balance', { userId, tokenType });
    return this.tokensService.getUserTokenBalance(userId, tokenType);
  }

  @Post('expire')
  expireTokens() {
    //     console.log('>>> TokensController: POST /tokens/expire');
    return this.tokensService.expireTokens();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //     console.log('>>> TokensController: GET /tokens/:id', id);
    return this.tokensService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
    //     console.log('>>> TokensController: PATCH /tokens/:id', { id, updateTokenDto });
    return this.tokensService.update(id, updateTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //     console.log('>>> TokensController: DELETE /tokens/:id', id);
    return this.tokensService.remove(id);
  }
}

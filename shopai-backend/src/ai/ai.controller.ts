import { Body, Controller, Post } from '@nestjs/common';
import { AiService, ChatHistoryItem } from './ai.service.js';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @Body() body: { message?: string; prompt?: string; history?: ChatHistoryItem[] },
  ) {
    const prompt = body.prompt || body.message || '';
    const result = await this.aiService.chat(prompt, body.history ?? []);
    return typeof result === 'object' && result !== null && 'reply' in result
      ? result
      : { reply: result };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ResponseMessageDto } from './dtos/webhook.dtos';
import { ApiKeyGuard } from 'src/api-key/api-key.guard';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/api')
  @HttpCode(200)
  async handleIncomingMessageMeta(@Body() body: any) {
    const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    const from = body.entry?.[0]?.changes?.[0].value.metadata;
    if (body.entry?.[0]?.changes?.[0]?.value.messages?.[0]) {
      await this.webhookService.markAsRead({
        messageId: message.id,
        from: from.phone_number_id,
      });
      return this.webhookService.webhook(body);
    }
    return { msg: 'holi' };
  }

  @Get('/api')
  verifyWebhook(
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.mode') mode: string,
  ) {
    const expectedToken = process.env.WHATSAPP_API_TOKEN_WEBHOOK;
    if (verifyToken === expectedToken && mode === 'subscribe') {
      return challenge;
    }
    return 'Invalid token';
  }

  @Post('/api/send')
  @UseGuards(ApiKeyGuard)
  async responseMessage(@Body() body: ResponseMessageDto) {
    return await this.webhookService.reponseMessage(body);
  }
}

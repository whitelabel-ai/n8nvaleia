import { Injectable } from '@nestjs/common';
import {
  MarkAsReadDto,
  ResponseMessageDto,
  WhatsAppWebhookDto,
} from './dtos/webhook.dtos';

@Injectable()
export class WebhookService {
  webhook(body: WhatsAppWebhookDto) {
    return body;
  }

  async reponseMessage({ from, to, message }: ResponseMessageDto) {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: message,
      },
    };

    return await this.sendToWhatsapp(payload, from);
  }

  async markAsRead({ messageId, from }: MarkAsReadDto) {
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    await this.sendToWhatsapp(payload, from);
  }

  async sendToWhatsapp(payload, from) {
    const response = await fetch(
      `${process.env.API_GRAPH_META}${from}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Error al enviar mensaje: ${JSON.stringify(result)}`);
    }
    return result;
  }
}

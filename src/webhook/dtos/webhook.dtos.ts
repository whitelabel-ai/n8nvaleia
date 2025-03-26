import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TextDto {
  @IsString()
  body: string;
}

class MessageDto {
  @IsString()
  from: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  timestamp: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => TextDto)
  text: TextDto;
}

class ProfileDto {
  @IsString()
  name: string;
}

class ContactDto {
  @ValidateNested()
  @Type(() => ProfileDto)
  @IsOptional()
  profile?: ProfileDto;

  @IsString()
  @IsOptional()
  wa_id?: string;
}

class MetadataDto {
  @IsString()
  display_phone_number: string;

  @IsString()
  phone_number_id: string;
}

class OriginDto {
  @IsString()
  type: string;
}

class ConversationDto {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => OriginDto)
  origin: OriginDto;
}

class PricingDto {
  @IsString()
  @IsOptional()
  billable?: string;

  @IsString()
  @IsOptional()
  pricing_model?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

class StatusesDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  timestamp?: string;

  @IsString()
  @IsOptional()
  recipient_id?: string;

  @ValidateNested()
  @Type(() => ConversationDto)
  @IsOptional()
  conversation?: ConversationDto;

  @ValidateNested()
  @Type(() => PricingDto)
  @IsOptional()
  pricing?: PricingDto;
}

class ValueDto {
  @IsString()
  @IsOptional()
  messaging_product?: string;

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatusesDto)
  @IsOptional()
  statuses?: StatusesDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  @IsOptional()
  messages?: MessageDto[];
}

class ChangeDto {
  @IsString()
  @IsOptional()
  field?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ValueDto)
  value: ValueDto;
}

class EntryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChangeDto)
  changes: ChangeDto[];
}

export class WhatsAppWebhookDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entry: EntryDto[];
}

export class ResponseMessageDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  message: string;
}

export class MarkAsReadDto {
  @IsString()
  messageId: string;

  @IsString()
  from: string;
}

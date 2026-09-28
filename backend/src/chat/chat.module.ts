import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { ChatbotKnowledge } from '../database/entities/chatbot-knowledge.entity';
import { ChatProductsService } from './chat-products.service';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ChatbotKnowledge])],
  controllers: [ChatController, KnowledgeController],
  providers: [ChatService, ChatProductsService, KnowledgeService],
})
export class ChatModule {}

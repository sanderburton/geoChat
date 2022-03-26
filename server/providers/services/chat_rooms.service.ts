import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'server/entities/chat_room.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class ChatRoomsService {
  fiveMilesLat = 0.07246376812;
  fiveMilesLon = 0.09157509158;

  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) {}

  findAll(userLat: number, userLon: number): Promise<ChatRoom[]> {
    console.log(userLat, userLon);
    return this.chatRoomRepository.find({
      where: {
        lat: Between(userLat - this.fiveMilesLat, userLat + this.fiveMilesLat),
        lon: Between(userLon - this.fiveMilesLon, userLon + this.fiveMilesLon),
      },
    });
  }

  findOne(id: number): Promise<ChatRoom> {
    return this.chatRoomRepository.findOne(id);
  }

  async create(chatRoom: ChatRoom): Promise<ChatRoom> {
    return this.chatRoomRepository.save(chatRoom);
  }
}

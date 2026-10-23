var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let ClientsService = class ClientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createClientDto) {
        const existingClient = await this.prisma.client.findUnique({
            where: { phone_number: createClientDto.phone_number },
        });
        if (existingClient) {
            throw new ConflictException(`Ya existe un cliente registrado con el número telefónico ${createClientDto.phone_number}`);
        }
        const client = await this.prisma.client.create({
            data: {
                phone_number: createClientDto.phone_number,
                name: createClientDto.name,
                chat_state: createClientDto.chat_state ?? 'idle',
            },
        });
        return client;
    }
    async findAll() {
        const clients = await this.prisma.client.findMany({
            include: {
                quotes: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        return clients;
    }
    async findOne(id) {
        const client = await this.prisma.client.findUnique({
            where: { id },
            include: {
                quotes: true,
            },
        });
        if (!client) {
            throw new NotFoundException(`No se encontró un cliente con el ID: ${id}`);
        }
        return client;
    }
    async findByPhone(phone_number) {
        const client = await this.prisma.client.findUnique({
            where: { phone_number },
            include: {
                quotes: true,
            },
        });
        if (!client) {
            throw new NotFoundException(`No se encontró un cliente con el número telefónico: ${phone_number}`);
        }
        return client;
    }
    async update(id, updateClientDto) {
        await this.findOne(id);
        if (updateClientDto.phone_number) {
            const existingClient = await this.prisma.client.findUnique({
                where: { phone_number: updateClientDto.phone_number },
            });
            if (existingClient && existingClient.id !== id) {
                throw new ConflictException(`El número telefónico ${updateClientDto.phone_number} ya está en uso por otro cliente.`);
            }
        }
        const updatedClient = await this.prisma.client.update({
            where: { id },
            data: updateClientDto,
        });
        return updatedClient;
    }
    async remove(id) {
        await this.findOne(id);
        const deletedClient = await this.prisma.client.delete({
            where: { id },
        });
        return deletedClient;
    }
};
ClientsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ClientsService);
export { ClientsService };
//# sourceMappingURL=clients.service.js.map
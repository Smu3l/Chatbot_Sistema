// src/clients/clients.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { Client } from '@prisma/client';

/**
 * Controlador REST para la gestión de Clientes (Usuarios)
 * Ruta base: /clients
 */
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * POST /clients
   * Crear un nuevo cliente
   * @param createClientDto - Datos del cliente a crear
   * @returns Cliente creado con código HTTP 201
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  /**
   * GET /clients
   * Obtener listado de todos los clientes
   * @returns Array de clientes con sus cotizaciones
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  /**
   * GET /clients/:id
   * Obtener un cliente por su ID (UUID)
   * @param id - UUID válido del cliente
   * @returns Cliente encontrado
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  /**
   * GET /clients/phone/:phone_number
   * Obtener un cliente por su número telefónico
   * Útil para integración con WhatsApp/Chatbot
   * @param phone_number - Número telefónico del cliente
   * @returns Cliente encontrado
   */
  @Get('phone/:phone_number')
  @HttpCode(HttpStatus.OK)
  async findByPhone(@Param('phone_number') phone_number: string): Promise<Client> {
    return this.clientsService.findByPhone(phone_number);
  }

  /**
   * PATCH /clients/:id
   * Actualizar parcialmente un cliente
   * @param id - UUID válido del cliente
   * @param updateClientDto - Campos a actualizar
   * @returns Cliente actualizado
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto);
  }

  /**
   * DELETE /clients/:id
   * Eliminar un cliente y sus cotizaciones asociadas (Cascade)
   * @param id - UUID válido del cliente
   * @returns Cliente eliminado
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Client> {
    return this.clientsService.remove(id);
  }
}

// src/clients/clients.service.ts

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { Client } from '@prisma/client';

/**
 * Servicio encargado de la lógica de negocio para la gestión de Clientes
 */
@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crear un nuevo cliente
   * @param createClientDto - Datos validados para crear el cliente
   * @returns Cliente creado
   * @throws ConflictException si el número telefónico ya existe
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Verificamos si ya existe un cliente con ese número telefónico
    const existingClient = await this.prisma.client.findUnique({
      where: { phone_number: createClientDto.phone_number },
    });

    if (existingClient) {
      throw new ConflictException(
        `Ya existe un cliente registrado con el número telefónico ${createClientDto.phone_number}`,
      );
    }

    // Creamos el cliente con los datos proporcionados
    // chat_state tomará el valor por defecto 'idle' si no se envía
    const client = await this.prisma.client.create({
      data: {
        phone_number: createClientDto.phone_number,
        name: createClientDto.name,
        chat_state: createClientDto.chat_state ?? 'idle',
      },
    });

    return client;
  }

  /**
   * Obtener todos los clientes registrados
   * @returns Lista de todos los clientes con sus cotizaciones
   */
  async findAll(): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      // Incluimos las cotizaciones relacionadas para tener mayor información
      include: {
        quotes: true,
      },
      // Ordenamos por fecha de creación descendente (más recientes primero)
      orderBy: {
        created_at: 'desc',
      },
    });

    return clients;
  }

  /**
   * Obtener un cliente por su ID
   * @param id - UUID del cliente
   * @returns Cliente encontrado con sus cotizaciones
   * @throws NotFoundException si el cliente no existe
   */
  async findOne(id: string): Promise<Client> {
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

  /**
   * Buscar un cliente por su número telefónico
   * Útil para identificar al usuario desde el webhook del chatbot
   * @param phone_number - Número telefónico del cliente
   * @returns Cliente encontrado con sus cotizaciones
   * @throws NotFoundException si el cliente no existe
   */
  async findByPhone(phone_number: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: { phone_number },
      include: {
        quotes: true,
      },
    });

    if (!client) {
      throw new NotFoundException(
        `No se encontró un cliente con el número telefónico: ${phone_number}`,
      );
    }

    return client;
  }

  /**
   * Actualizar parcialmente la información de un cliente
   * @param id - UUID del cliente a actualizar
   * @param updateClientDto - Datos a actualizar
   * @returns Cliente actualizado
   * @throws NotFoundException si el cliente no existe
   * @throws ConflictException si se intenta actualizar a un phone_number ya existente
   */
  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    // Verificamos que el cliente exista
    await this.findOne(id);

    // Si se quiere actualizar el número telefónico, validamos que no esté en uso
    if (updateClientDto.phone_number) {
      const existingClient = await this.prisma.client.findUnique({
        where: { phone_number: updateClientDto.phone_number },
      });

      // Solo lanzamos error si el número pertenece a otro cliente diferente
      if (existingClient && existingClient.id !== id) {
        throw new ConflictException(
          `El número telefónico ${updateClientDto.phone_number} ya está en uso por otro cliente.`,
        );
      }
    }

    // Actualizamos el cliente
    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });

    return updatedClient;
  }

  /**
   * Eliminar un cliente
   * Gracias a onDelete: Cascade en Quote, se eliminarán sus cotizaciones también
   * @param id - UUID del cliente a eliminar
   * @returns Cliente eliminado
   * @throws NotFoundException si el cliente no existe
   */
  async remove(id: string): Promise<Client> {
    // Verificamos que el cliente exista
    await this.findOne(id);

    const deletedClient = await this.prisma.client.delete({
      where: { id },
    });

    return deletedClient;
  }
}

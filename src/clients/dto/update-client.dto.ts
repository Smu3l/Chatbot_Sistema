// src/clients/dto/update-client.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto.js';

/**
 * DTO para la actualización parcial de un cliente
 * Hereda todos los campos de CreateClientDto, pero los hace opcionales
 * gracias a PartialType
 */
export class UpdateClientDto extends PartialType(CreateClientDto) {}

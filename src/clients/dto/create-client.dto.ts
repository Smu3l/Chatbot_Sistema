// src/clients/dto/create-client.dto.ts

import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de un nuevo cliente
 * Define las reglas de validación para los datos entrantes desde el cliente HTTP
 */
export class CreateClientDto {
  /**
   * Número telefónico del cliente
   * Debe ser único y con formato internacional o nacional válido
   * @example "+56912345678"
   */
  @IsString({ message: 'El número telefónico debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El número telefónico es obligatorio.' })
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'El número telefónico debe contener entre 7 y 15 dígitos, con o sin prefijo +.',
  })
  phone_number: string;

  /**
   * Nombre completo del cliente
   * Campo opcional al momento del primer contacto
   * @example "Juan Pérez"
   */
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsOptional()
  name?: string;

  /**
   * Estado de conversación del chatbot
   * Por defecto 'idle' si no se especifica
   * @example "awaiting_service"
   */
  @IsString({ message: 'El estado del chat debe ser una cadena de texto.' })
  @IsOptional()
  chat_state?: string;
}

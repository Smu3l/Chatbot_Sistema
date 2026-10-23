var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
export class CreateClientDto {
    phone_number;
    name;
    chat_state;
}
__decorate([
    IsString({ message: 'El número telefónico debe ser una cadena de texto.' }),
    IsNotEmpty({ message: 'El número telefónico es obligatorio.' }),
    Matches(/^\+?[0-9]{7,15}$/, {
        message: 'El número telefónico debe contener entre 7 y 15 dígitos, con o sin prefijo +.',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone_number", void 0);
__decorate([
    IsString({ message: 'El nombre debe ser una cadena de texto.' }),
    IsOptional(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    IsString({ message: 'El estado del chat debe ser una cadena de texto.' }),
    IsOptional(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "chat_state", void 0);
//# sourceMappingURL=create-client.dto.js.map
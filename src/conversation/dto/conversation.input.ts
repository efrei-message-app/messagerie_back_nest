import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  // Pas besoin d'id, il sera généré par Prisma
}

@InputType()
export class UpdateConversationInput {
  // Si tu veux mettre à jour la date ou autre, sinon vide
}

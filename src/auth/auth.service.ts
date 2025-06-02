import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string) {
    if (email === 'admin@admin.com' && password === 'admin') {
      return { id: 'user-123', email };
    }
    return null;
  }
}

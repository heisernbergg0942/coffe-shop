import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return { status: 'ok', message: 'Coffee Shop API is running' };
  }
}

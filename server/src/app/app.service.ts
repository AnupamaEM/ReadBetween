import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
  getHealth() {
    return {
      status: 'ok',
      service: 'readbetween-api',
      timestamp: new Date().toISOString(),
    };
  }
}

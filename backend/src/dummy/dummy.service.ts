import { Injectable } from '@nestjs/common';

@Injectable()
export class DummyService {
  constructor() {
    //     console.log('>>> DummyService Constructor Executed');
  }
  getHello(): string {
    return 'Hello from DummyService!';
  }
}

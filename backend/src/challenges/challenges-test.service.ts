import { Injectable } from '@nestjs/common';

@Injectable()
export class ChallengesTestService {
  constructor() {
    console.log(
      '[ChallengesTestService] Constructor called - basic service works'
    );
  }

  getTest() {
    return { message: 'Test service is working' };
  }
}

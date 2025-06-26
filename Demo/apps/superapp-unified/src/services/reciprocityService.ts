import axios from 'axios';

// Refined types representing our reciprocity ecosystem
export interface CommunityService {
  id: string;
  name: string;
  description: string;
  category: 'Skill Exchange' | 'Sustainable Goods' | 'Social Impact';
  provider: {
    id: string;
    name: string;
    meritoScore: number;
  };
  öndas: number; // Energy units representing community value
  image: string;
  location?: string;
  availableDates?: Date[];
}

export interface SkillExchange {
  fromMemberId: string;
  toMemberId: string;
  service: CommunityService;
  exchangeDate: Date;
  öndas: number;
}

class ReciprocityService {
  private apiBaseUrl = '/api/reciprocity';

  // Find services aligned with community needs
  async findCommunityServices(filters?: {
    category?: 'Skill Exchange' | 'Sustainable Goods' | 'Social Impact';
    location?: string;
  }): Promise<CommunityService[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/services`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error finding community services:', error);
      return [];
    }
  }

  // Initiate a skill or service exchange
  async initiateExchange(exchange: SkillExchange): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/exchanges`, exchange);
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error initiating exchange:', error);
      return false;
    }
  }

  // Calculate community impact
  calculateCommunityImpact(exchanges: SkillExchange[]): number {
    return exchanges.reduce((total, exchange) => total + exchange.öndas, 0);
  }

  // Recommend services based on member's profile
  async recommendServices(memberId: string): Promise<CommunityService[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/recommendations/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}

export default new ReciprocityService();

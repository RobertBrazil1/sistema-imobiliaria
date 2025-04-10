import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  type: 'house' | 'apartment' | 'land';
  imageUrl: string;
  features: string[];
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
}

export interface PropertyFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

class PropertyService {
  async getAllProperties(): Promise<Property[]> {
    const response = await api.get<Property[]>('/properties');
    return response.data;
  }

  async getPropertyById(id: string): Promise<Property> {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  }

  async searchProperties(filters: PropertyFilters): Promise<Property[]> {
    const response = await api.get<Property[]>('/properties/search', {
      params: filters,
    });
    return response.data;
  }

  async createProperty(propertyData: Omit<Property, 'id'>): Promise<Property> {
    const response = await api.post<Property>('/properties', propertyData);
    return response.data;
  }

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    const response = await api.put<Property>(`/properties/${id}`, propertyData);
    return response.data;
  }

  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  }
}

export const propertyService = new PropertyService(); 
import apiClient from './apiClient';

export interface Character {
  id: string;
  name: string;
  house: string | null;
  ancestry: string | null;
}

export const getCharacters = async (): Promise<Character[]> => {
  try {
    const response = await apiClient.get('/characters');
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

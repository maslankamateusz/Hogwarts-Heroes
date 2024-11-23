import apiClient from './apiClient';

export interface Character {
  id: string;
  name: string;
  image: string;
}

export const processCharacters = (rawCharacters: any[]): Character[] => {
  return rawCharacters.map((char) => ({
    id: char.id,
    name: char.attributes.name || 'Unknown',
    image: char.attributes.image || null
  }));
};


export const getCharacters = async (): Promise<Character[]> => {
  try {
    const response = await apiClient.get('/characters');
    const rawCharacters = response.data.data;
    const processedCharacters = processCharacters(rawCharacters);

    return processedCharacters; 
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

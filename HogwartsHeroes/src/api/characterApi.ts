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

export const getAllCharacters = async (): Promise<Character[]> => {
  let allCharacters: Character[] = [];
  let currentPage = 1;
  let lastPage = 1;

  try {
    while (currentPage <= lastPage) {
      const response = await apiClient.get('/characters', {
        params: {
          'page[number]': currentPage,  
        },
      });

      const rawCharacters = response.data.data;
      const processedCharacters = processCharacters(rawCharacters);
      allCharacters = [...allCharacters, ...processedCharacters];

      lastPage = response.data.meta.pagination.last;

      if (currentPage < lastPage) {
        currentPage++;
      } else {
        break;
      }
    }

    return allCharacters;
  } catch (error) {
    console.error('Error fetching all characters:', error);
    throw error;
  }
};


export const searchCharacters = async (searchQuery: string): Promise<Character[]> => {
  if (!searchQuery.trim()) {
    return await getAllCharacters(); 
  }

  let allCharacters: Character[] = [];


  try {
    allCharacters = await getAllCharacters();

    const searchWords = searchQuery.trim().split(/\s+/);

    const filteredCharacters = allCharacters.filter(character => {
      return searchWords.every(word => character.name.toLowerCase().includes(word.toLowerCase()));
    });

    return filteredCharacters;

  } catch (error) {
    console.error('Error fetching characters by search:', error);
    throw error;
  }
};

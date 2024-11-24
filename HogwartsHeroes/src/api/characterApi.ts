import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_KEY = 'charactersCache';

const apiClient = axios.create({
  baseURL: 'https://api.potterdb.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const loadCacheFromLocalStorage = async (): Promise<{ characters: Character[]; timestamp: number | null }> => {
  try {
    const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return {
        characters: parsedData.characters || [],
        timestamp: parsedData.timestamp || null,
      };
    }
  } catch (error) {
    console.error('Error loading from AsyncStorage:', error);
  }
  return { characters: [], timestamp: null };
};

const saveCacheToLocalStorage = async (characters: Character[]) => {
  const cacheData = {
    characters,
    timestamp: Date.now(),
  };
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to AsyncStorage:', error);
  }
};

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export interface Character {
  id: string;
  name: string;
  image: string | null;
}

export interface CharacterDetails extends Character {
  house: string | null;
  patronus: string | null;
  species: string | null;
  wiki: string;
  blood_status: string | null;
  alias_names: string[];
  born: string | null;
  died: string | null;
}

export interface CharacterFilterParams {
  house?: string;
  gender?: string;
  bloodStatus?: string;
  born?: string;
  died?: string;
  [key: string]: string | undefined;
}

export const processCharacters = (rawCharacters: any[]): Character[] => {
  return rawCharacters.map((char) => ({
    id: char.id,
    name: char.attributes.name || 'Unknown',
    image: char.attributes.image || null,
  }));
};

export const processCharacterDetails = (rawCharacter: any): CharacterDetails => {
  return {
    id: rawCharacter.id,
    name: rawCharacter.attributes.name || 'Unknown',
    image: rawCharacter.attributes.image || null,
    house: rawCharacter.attributes.house || 'Unknown',
    patronus: rawCharacter.attributes.patronus || null,
    species: rawCharacter.attributes.species || null,
    wiki: rawCharacter.attributes.wiki || '',
    blood_status: rawCharacter.attributes.blood_status || null,
    alias_names: rawCharacter.attributes.alias_names || [],
    born: rawCharacter.attributes.born || 'Unknown',
    died: rawCharacter.attributes.died || 'Unknown',
  };
};

export const getAllCharacters = async (): Promise<Character[]> => {
  const { characters, timestamp } = await loadCacheFromLocalStorage();

  if (characters.length > 0 && timestamp && Date.now() - timestamp < 24 * 60 * 60 * 1000) {
    console.log('Using cached characters');
    return characters;
  }

  console.log('Fetching all characters from API...');
  let allCharacters: Character[] = [];
  let currentPage = 1;
  let lastPage = 1;

  try {
    while (currentPage <= lastPage) {
      const response = await apiClient.get('/characters', {
        params: {
          'page[number]': currentPage,
          'page[size]': 100,
        },
      });

      const rawCharacters = response.data.data;
      const processedCharacters = processCharacters(rawCharacters);
      allCharacters = [...allCharacters, ...processedCharacters];

      lastPage = response.data.meta.pagination.last;
      currentPage++;
    }

    await saveCacheToLocalStorage(allCharacters);
    return allCharacters;
  } catch (error) {
    console.error('Error fetching all characters:', error);
    throw error;
  }
};

export const searchCharacters = async (searchQuery: string): Promise<Character[]> => {
  const allCharacters = await getAllCharacters();
  if (!searchQuery.trim()) return allCharacters;

  const searchWords = searchQuery.trim().toLowerCase().split(/\s+/);
  return allCharacters.filter((character) =>
    searchWords.every((word) => character.name.toLowerCase().includes(word))
  );
};

export const getFilteredCharacters = async (filters: CharacterFilterParams): Promise<Character[]> => {
  let allFilteredCharacters: Character[] = [];
  let currentPage = 1;
  let lastPage = 1;

  try {
    const apiFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc[`filter[${key}_cont]`] = value; 
      }
      return acc;
    }, {} as Record<string, string>);

    while (currentPage <= lastPage) {
      const response = await apiClient.get('/characters', {
        params: {
          ...apiFilters,
          'page[number]': currentPage,
          'page[size]': 100, 
        },
      });

      const rawCharacters = response.data.data;
      const processedCharacters = processCharacters(rawCharacters);
      allFilteredCharacters = [...allFilteredCharacters, ...processedCharacters];

      lastPage = response.data.meta.pagination.last;
      currentPage++;
    }

    return allFilteredCharacters;
  } catch (error) {
    console.error('Error fetching filtered characters:', error);
    throw error;
  }
};

export const getCharacterDetails = async (id: string): Promise<CharacterDetails | null> => {
  try {
    const response = await apiClient.get(`/characters/${id}`);

    if (response.data && response.data.data) {
      const character = processCharacterDetails(response.data.data);
      return character;
    }
    return null;
  } catch (error) {
    console.error('Error fetching character details:', error);
    throw error;
  }
};

export const getFilterFields = (): string[] => {
  return ['house', 'patronus', 'species', 'blood_status', 'gender'];
};

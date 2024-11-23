import { getCharacters } from '../api/characterApi';


(async () => {
  try {
    console.log('Fetching all characters...');
    const charactersList = await getCharacters();
    console.log(charactersList);

  } catch (error) {
    console.error('Test failed:', error);
  }
})();

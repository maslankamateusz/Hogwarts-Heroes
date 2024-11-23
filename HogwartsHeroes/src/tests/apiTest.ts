import { getAllCharacters, searchCharacters } from '../api/characterApi';


(async () => {
  try {
    // console.log('Fetching all characters...');
    // const charactersList = await getAllCharacters();
    // console.log(charactersList[1240]);

    const character = await searchCharacters("Harry potter");
    console.log(character);

  } catch (error) {
    console.error('Test failed:', error);
  }
})();

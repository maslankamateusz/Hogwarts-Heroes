import { getAllCharacters, searchCharacters, getFilteredCharacters, getCharacterDetails } from '../api/characterApi';


(async () => {
  try {
    // console.log('Fetching all characters...');
    // const charactersList = await getAllCharacters();
    // console.log(charactersList[1240]);

    // const character = await searchCharacters("Harry potter");
    // console.log(character);

    // const filteredCharacters = await getFilteredCharacters({ house: 'Gryffindor', gender: 'Male'});
    // console.log(filteredCharacters);
    
    const characterDetail = await getCharacterDetails("d1f94573-614b-4e67-a372-2ff5ef641456");
    console.log(characterDetail);

  } catch (error) {
    console.error('Test failed:', error);
  }
})();

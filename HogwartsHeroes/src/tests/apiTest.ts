import { getAllCharacters, searchCharacters, getFilteredCharacters,  } from '../api/characterApi';


(async () => {
  try {
    // console.log('Fetching all characters...');
    // const charactersList = await getAllCharacters();
    // console.log(charactersList[1240]);

    // const character = await searchCharacters("Harry potter");
    // console.log(character);

    // const filteredCharacters = await getFilteredCharacters({ house: 'Gryffindor', gender: 'Male'});
    // console.log(filteredCharacters);


  } catch (error) {
    console.error('Test failed:', error);
  }
})();

import { getAllCharacters, searchCharacters, getCharacterDetails, getFilterFields, getFilteredCharacters, CharacterFilterParams} from '../api/characterApi';
import { getQuizQuestions } from "../api/quizApi";

(async () => {
  try {
    // console.log('Fetching all characters...');
    // const charactersList = await getAllCharacters();
    // console.log(charactersList);

    // const character = await searchCharacters("Ronald");
    // console.log(character);

    // const filteredCharacters = await getFilteredCharacters({ house: 'Gryffindor' });
    // console.log(filteredCharacters);
    
    // const characterDetail = await getCharacterDetails("d1f94573-614b-4e67-a372-2ff5ef641456");
    // console.log(characterDetail);

    // const filters = await getAvailableFilters();
    // console.log(filters);
    
    // console.log(getFilterFields());
    
    // const questions = await getQuizQuestions();
    // console.log(questions);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
})();


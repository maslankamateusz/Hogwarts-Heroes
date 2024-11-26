import { promises as fs } from 'fs'; 
import path from 'path'; 

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export const getQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const filePath = path.resolve(__dirname, '../../assets/data/quizQuestions.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const questions: QuizQuestion[] = JSON.parse(fileData);
    return questions;
  } catch (error) {
    console.error('Error loading quiz questions:', error);
    throw error;
  }
};

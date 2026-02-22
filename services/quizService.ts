
import { Word, Question } from '../types';
import { QUESTIONS_PER_ROUND } from '../constants';
import { getWordsByLevelAndGrade } from '../data';

export const generateQuiz = (level: 'primary' | 'junior' | 'senior', grade?: number): Question[] => {
  const allRelatedWords = getWordsByLevelAndGrade(level, grade);

  if (allRelatedWords.length === 0) {
    console.warn(`No words found for level ${level} grade ${grade}`);
    return [];
  }

  // Shuffle all words
  const shuffled = [...allRelatedWords].sort(() => 0.5 - Math.random());

  // Select questions
  const selectedWords = shuffled.slice(0, Math.min(shuffled.length, QUESTIONS_PER_ROUND));

  return selectedWords.map(word => {
    // Distractors should come from the SAME pool (same grade/level) to be appropriate
    const distractorBank = allRelatedWords.filter(w => w.id !== word.id);

    // We need 3 distractors
    const distractors = distractorBank
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.chinese);

    // If we don't have enough distractors (e.g. very small word list), pad with "Wrong Answer" or similar? 
    // Ideally our word lists are large enough. If not, this might be an issue. 
    // But for now we assume lists are > 4 words.

    const options = [word.chinese, ...distractors].sort(() => 0.5 - Math.random());

    return {
      word,
      options,
      correctAnswer: word.chinese
    };
  });
};

export const calculatePoints = (percentage: number): number => {
  if (percentage < 60) return 0;
  if (percentage < 70) return 5;
  if (percentage < 80) return 10;
  if (percentage < 90) return 20;
  return 50;
};


import { Word } from '../types';
import { primaryWords } from './primary';
import { juniorWords } from './junior';
import { seniorWords } from './senior';

export const allWords = {
    primary: primaryWords,
    junior: juniorWords,
    senior: seniorWords,
};

export const getWordsByLevelAndGrade = (level: 'primary' | 'junior' | 'senior', grade?: number): Word[] => {
    let words: Word[] = [];

    switch (level) {
        case 'primary':
            words = primaryWords;
            break;
        case 'junior':
            words = juniorWords;
            break;
        case 'senior':
            words = seniorWords;
            break;
        default:
            return [];
    }

    if (grade) {
        return words.filter(word => word.grade === grade);
    }

    return words;
};

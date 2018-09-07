import { consonants } from './unicode/characters';
import contains from './contains';
import is from './is';
import isAll from './isAll';

const consonant = char => consonants[char];
export const isConsonant = is(consonant);
export const isConsonantAll = isAll(consonant);
export const containsConsonant = contains(consonant);

export type CharacterOptionType = 'frog' | 'chick';

export type CharacterSizeType = 'large' | 'middle' | 'small';

export interface CharacterInfoInterface {
  characterOption: CharacterOptionType;
  characterSize: CharacterSizeType;
  characterKey: string;
}

export type CharacterPosition =
  | { row: number; col: number }
  | { row: null; col: null };

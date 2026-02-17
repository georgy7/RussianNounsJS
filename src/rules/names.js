import { createReversedTrie, extendAllSuffixes } from "../utils/trie.js";

export const surnameType1 = createReversedTrie(['ов', 'ев', 'ёв', 'ин', 'ын']);
export const surnameType1Plural = extendAllSuffixes('ы', surnameType1);

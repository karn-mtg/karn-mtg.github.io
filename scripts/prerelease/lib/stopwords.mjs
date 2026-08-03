// Generic/grammatical filler words to discard from the word cloud, per
// feature.md ("discard things like of, card, name of the card, whenever X").
// Deliberately keeps MTG action/command words (sacrifice, discard, exile,
// graveyard, ...) since those are exactly the "core command/action words
// that prove synergy" the word cloud is meant to surface.
export const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by',
  'can', "can't", 'cannot', 'card', 'cards', 'choose', 'chosen', 'control', 'controller', 'controls',
  'do', 'does', "doesn't", 'during',
  'each', 'either', 'end', 'ends', 'equal', 'extra',
  'for', 'from',
  'gets', 'get', 'has', 'have', 'having',
  'if', 'in', 'instead', 'into', 'is', 'it', 'its', "it's",
  'less', 'may',
  'more', 'most', 'name', 'named', 'no', 'not',
  'of', 'on', 'once', 'one', 'only', 'or', 'other', 'others', 'own',
  'per', 'put', 'puts',
  'same', 'shall', 'so', 'such',
  'than', 'that', 'the', 'their', 'them', 'then', 'these', 'they', 'this', 'those', 'through', 'times', 'time', 'to', 'turn', 'turns', 'twice',
  'up', 'until',
  'was', 'way', 'ways', 'were', 'when', 'whenever', 'where', 'which', 'while', 'who', 'will', 'with', 'without', 'would',
  'you', 'your',
  // Generic Magic nouns that show up on almost every card regardless of what
  // the card actually does — not a synergy signal on their own.
  'creature', 'creatures', 'opponent', 'opponents', 'hand', 'token', 'tokens',
  'permanent', 'permanents', 'player', 'players', 'battlefield',
])

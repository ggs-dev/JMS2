const Filter = require('bad-words');
const levenshtein = require('fast-levenshtein');

let filterNumbersAndSpecialChars = false;

const similarityThreshold = 0.8;

const customBadWords = ['snickers'];

const badWordsFilter = new Filter({ list: customBadWords });

customBadWords.forEach((word) => {
  badWordsFilter.addWords(word);
});

const whitelist = ['hello', 'funny', 'picks', 'shine', 'meets', 'where', 'space','ships'];

const filterBadWordsWithLevenshtein = (text) => {
  const words = text.split(' ');

  const filteredWords = words.filter((word) => {
    if (whitelist.includes(word.toLowerCase())) {
      return true;
    }

    let maxSimilarity = 0;
    const badWordMatch = badWordsFilter.list.find((badWord) => {
      const distance = levenshtein.get(word, badWord);
      const similarity = 1 - distance / Math.max(word.length, badWord.length);
      maxSimilarity = Math.max(maxSimilarity, similarity);
      return similarity >= similarityThreshold;
    });

    const isFiltered = badWordMatch !== undefined;

    if (isFiltered) {
      console.log(`Filtered word detected: "${word}" - Bad word match: ${badWordMatch} - Similarity: ${maxSimilarity}`);
    }
    return !isFiltered;
  });

  return filteredWords.join(' ');
};


const filterLinks = (text) => {
  const urlPattern = /https?:\/\/[^\s]+/g;
  return text.replace(urlPattern, '');
};

const filterText = (text) => {
  let filteredText = text;

  filteredText = filterLinks(filteredText);

  if (filterNumbersAndSpecialChars) {
    filteredText = filteredText.replace(/[\d\W]/g, '');
  }

  filteredText = filterBadWordsWithLevenshtein(filteredText);
  filteredText = textFilter(filteredText); // Add this line to apply the replacements

  return filteredText;
};

// Add the textFilter and escapeRegExp functions here
function textFilter(text) {
  const replacements = [
    { key: ":)", value: "Happy Face" },
    { key: ":D", value: "Extremely Happy Face" },
    { key: ":(", value: "Sad Face" },
    { key: ":o", value: "Surprised face" },
    { key: ":z", value: "Tired Face" },
    { key: "B)", value: "Cool Face" },
    { key: ":/", value: "Concerned Face" },
    { key: ";)", value: "Winkie Face" },
    { key: ":p", value: "Winkie Tounge" },
    { key: "R)", value: "YAAARRR" },
    { key: ";p", value: "Tongue" },
    { key: "o_O", value: "uhhhhh" },
    { key: ">(", value: "L O L" },
    { key: "bobheaJMS", value: "John Madden" },
    { key: "clawRM", value: "RIGGED" },
    { key: "useles2Duck", value: "Useless Duck Company" },
    { key: "SnickersHype", value: "hype" },
  ];

  let filteredText = text;
  replacements.forEach(({ key, value }) => {
    filteredText = filteredText.replace(new RegExp(escapeRegExp(key), "g"), value);
  });

  return filteredText;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

module.exports = filterText;
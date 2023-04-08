const tmi = require('tmi.js');
const { Worker } = require('worker_threads');
const Filter = require('bad-words');
const levenshtein = require('fast-levenshtein');
require('dotenv').config();

let metaphone;

const twitchUsername = process.env.TWITCH_USERNAME;
const twitchOAuthToken = process.env.TWITCH_OAUTH_TOKEN;
const channelName = process.env.TWITCH_CHANNEL;

const MODE_SKIP = 1;
const MODE_CHAOS = 2;
const MODE_QUEUE = 3;

let currentMode = MODE_QUEUE;

let messageQueue = [];
let isPlaying = false;
let filterNumbersAndSpecialChars = false;

const similarityThreshold = 0.8;

const customBadWords = ['snickers'];

const badWordsFilter = new Filter({ list: customBadWords });

customBadWords.forEach((word) => {
  badWordsFilter.addWords(word);
});

const whitelist = ['hello'];

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

const playNextInQueue = () => {
  if (currentMode === MODE_QUEUE && messageQueue.length > 0) {
    playText(messageQueue.shift());
  } else {
    isPlaying = false;
  }
};

const worker = new Worker('./worker.js');

worker.on('message', () => {
  isPlaying = false;

  if (currentMode === MODE_SKIP) {
    setTimeout(() => {
      playNextInQueue();
    }, 30000); // 30-second delay between skipped messages so its tollerable.
  } else {
    playNextInQueue();
  }
});


const playText = (textObj) => {
  const filteredText = filterText(textObj.message);
  if (filteredText.trim() === '') {
    if (currentMode !== MODE_CHAOS) {
      playNextInQueue(); // Process the next message in the queue when the current message is empty after filtering.
    }
    return;
  }

  if (currentMode === MODE_CHAOS) {
    const chaosWorker = new Worker('./worker.js');
    chaosWorker.postMessage({ text: filteredText, username: textObj.username });
  } else {
    isPlaying = true;
    worker.postMessage({ text: filteredText, username: textObj.username });
  }
};


const startTwitchClient = async () => {
  const metaphoneModule = await import('double-metaphone');
  metaphone = metaphoneModule.doubleMetaphone;

  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: {
      username: twitchUsername,
      password: twitchOAuthToken,
    },
    channels: [channelName],
  });

  client.connect();

  client.on('message', (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate.username;

    if (currentMode === MODE_CHAOS) {
      playText({ username, message });
    } else {
      switch (currentMode) {
        case MODE_SKIP:
          if (!isPlaying) {
            isPlaying = true;
            playText({ username, message });
          }
          break;
        case MODE_QUEUE:
        default:
          if (!isPlaying) {
            isPlaying = true;
            playText({ username, message });
          } else {
            messageQueue.push({ username, message });
          }
          break;
      }
    }
  });
};

startTwitchClient();

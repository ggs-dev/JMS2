const tmi = require('tmi.js');
const { Worker } = require('worker_threads');
const filterText = require('./wordFilterSystem');
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

const handleModeChange = (command, username) => {
  const mode = command.split(' ')[1];

  if (username === channelName) {
    switch (mode) {
      case 'skip':
        currentMode = MODE_SKIP;
        console.log(`Mode changed to: SKIP`);
        break;
      case 'chaos':
        currentMode = MODE_CHAOS;
        console.log(`Mode changed to: CHAOS`);
        break;
      case 'queue':
        currentMode = MODE_QUEUE;
        console.log(`Mode changed to: QUEUE`);
        break;
      default:
        console.log(`Invalid mode: ${mode}`);
    }
  } else {
    console.log(`User ${username} is not authorized to change the mode.`);
  }
};

const startTwitchClient = async () => {
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

    if (message.startsWith('!mode')) {
      handleModeChange(message, username);
      return;
    }

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

const { parentPort } = require('worker_threads');
const { say, Speaker } = require('dectalk');
const speakerModule = require('speaker');
const { Readable } = require('stream');

parentPort.on('message', async (textObj) => {
  const { text, username } = textObj;

  const voice = generateVoice(username);
  const sampleRate = generateSampleRate(username);

  const options = {
    voice: voice,
    sampleRate: sampleRate,
    EnableCommands: false,
  };

  const audioData = await say(text, options);

  const audioStream = new Readable({
    read() {
      this.push(audioData);
      this.push(null);
    },
  });

  const newSpeaker = new speakerModule({
    channels: 1,
    bitDepth: 16,
    sampleRate: sampleRate,
    signed: true,
  });
  newSpeaker.on('finish', () => parentPort.postMessage('finished'));
  audioStream.pipe(newSpeaker);
});

function generateVoice(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const charCode = username.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }

  const voice = hash % Object.keys(Speaker).length;
  return voice;
}

function generateSampleRate(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const charCode = username.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }

  const range = 12000 - 8000;
  const sampleRate = 8000 + Math.abs(hash % (range + 1));
  return sampleRate;
}

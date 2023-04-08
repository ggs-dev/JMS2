# JMS2 (John Madden Simulator 2)

This project is a Twitch chat bot that converts chat messages into Text-to-Speech (TTS) audio using DECTalk. It uses the TMI.js library to connect to Twitch chat and filters out messages containing links, inappropriate words, and certain special characters. 

## Features:

- Plays text-to-speech messages in a Twitch chat channel using DECtalk.
- Supports Windows and Linux operating systems. (Dectalk Voices are not supported on Windows)
- Uses a filter to prevent the use of bad language and to remove links from messages.
- Can be set to a "skip" mode plays one message and skips all messages till its finished, "queue" mode where messages are added to a queue and played one at a time and "chaos" mode where all messages are played simultaneously. 
- Includes various replacement phrases for recognized syntax.
- Uses Twitch usernames to set a voice and alter the sample rate to make all users talking sound unique.


## Dependencies

- TMI.js: Twitch Messaging Interface for connecting to and interacting with Twitch chat
- DECTalk: Text-to-Speech solution for generating audio
- Bad-words: A library for filtering out inappropriate words from messages
- Fast-levenshtein: A fast Levenshtein distance algorithm for calculating the similarity between words
- dotenv: A module for loading environment variables from a `.env` file

## Installation

1. Clone the repository:

`git clone https://github.com/Heavybob/jms2.git`


2. Navigate to the project directory:

`cd jms2`


3. Install dependencies using Yarn:

`yarn`


4. Create a `.env` file in the project root directory (or rename the .env.example) and set the following environment variables:

```
TWITCH_USERNAME = <your_twitch_username>
TWITCH_OAUTH_TOKEN = <your_twitch_oauth_token>
TWITCH_CHANNEL = <channel_to_join>
```

Replace `<your_twitch_username>`, `<your_twitch_oauth_token>`, and `<channel_to_join>` with the respective values.

To generate a Twitch OAuth token, visit [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/).

5. Run the bot using Yarn:

`yarn start`


Now the bot will connect to the specified Twitch channel and start converting chat messages into Text-to-Speech audio using DECTalk.

Note: Please refer to the DECTalk library's documentation for configuring and using the TTS features.


# Social Block ![License](https://img.shields.io/badge/license-MIT-blue) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)

Social Block is a blockchain-powered virtual world where crypto enthusiasts can connect, collaborate, play games, and have fun. Inspired by Gather.town and built upon the open-source SkyOffice platform, Social Block creates an immersive digital space tailored for the Web3 community.

Social Block combines the best of social networking, online gaming, and blockchain technology. It provides a space where users can:

- Create custom rooms for hangouts, meetings, or events
- Interact with others through proximity-based voice and video chat
- Play mini-games and participate in collaborative activities
- Host and attend virtual concerts and conferences
- Integrate their web3 social identities (Farcaster, Lens, etc.) and assets.

Whether you're looking to network with fellow crypto enthusiasts, host a virtual hackathon, or just hang out in a blockchain-themed space, Social Block offers a unique and engaging experience.

Social Block works on all PC browsers (mobile browsers are currently not supported)

## Built with

- [Phaser3](https://github.com/photonstorm/phaser) - Game engine
- [Colyseus](https://github.com/colyseus/colyseus) - WebSocket-based server framework
- [React/Redux](https://github.com/facebook/react) - Front-end framework
- [PeerJS](https://github.com/peers/peerjs) - WebRTC for video/screen sharing
- [TypeScript](https://github.com/microsoft/TypeScript) and [ES6](https://github.com/eslint/eslint) - for both client and server sides

## Features

- [Proximity Chat](#proximity-chat-distance-based-interactive-system)
- [Flexible Screen Sharing](#flexible--immediate-screen-sharing)
- [Multifunctional Rooms](#multifunctional-rooms)
- [Text Message Chat](#text-message-chat-with-real-time-dialog-bubbles)
- [Custom/Private Rooms](#customprivate-rooms)
- [Embedded Whiteboards](#embedded-whiteboards) (iframe embed of [WBO](https://github.com/lovasoa/whitebophir))

### Proximity Chat (distance-based interactive system)

![image](https://user-images.githubusercontent.com/11501902/139960852-cf0e0883-8fbe-459d-bb11-3707d0ae1360.png)

### Multifunctional Rooms

![image](https://user-images.githubusercontent.com/11501902/139961091-1801bd4d-fbd6-4400-8503-85ece744e979.png)

### Flexible & Immediate Screen Sharing

![image](https://user-images.githubusercontent.com/11501902/139961155-44a85cd9-ac25-4563-9d82-6537ed7435f6.png)

### Text Message Chat (with real time dialog bubbles)

![image](https://user-images.githubusercontent.com/11501902/145925423-3b5b9026-d3b9-429d-920b-98b0bcd6300a.png)

### Embedded Whiteboards

![image](https://user-images.githubusercontent.com/11501902/147785323-19dbf0e6-056d-44c5-8efe-e969297bbe52.png)

### Custom/Private Rooms

![image](https://user-images.githubusercontent.com/11501902/147784118-15ef50bf-0f67-4704-89d7-81b2fa7f8ceb.png)

## Controls

- `W, A, S, D, or arrow keys` to move (video chat will start if you are close to someone else)
- `E` to sit down
- `R` to use computer (for screen sharing)
- `Enter` to open chat
- `ESC` to close chat

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/) installed.

## Getting Started

Clone this repository to your local machine:

```bash
git clone https://github.com/jelilat/social-block.git
```

This will create a folder named `social-block`. You can specify a different folder name like this:

```bash
git clone https://github.com/jelilat/social-block.git my-folder-name
```

To start a server, go into the project folder and install dependencies/run start command:

```bash
cd social-block or 'my-folder-name'
yarn && yarn start
```

To start a client, go into the client folder and install dependencies/run start command:

```bash
cd social-block/client or 'my-folder-name/client'
yarn && yarn dev
```

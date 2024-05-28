# TOP-crosschain-front

Cross-chain bridge frontend based on TOP-EVM network. 

Note：Certain page parameters are dynamically fetched from smart contracts deployed on TOP-EVM.

## Tech Stack

  - [React](https://reactjs.org/)
  - [Typesctript](https://typescriptlang.org/)

## Environment Setup
Install [Node.js 16](https://nodejs.org) and npm

## Running Locally

```bash
yarn
yarn dev
```
Open your browser and visit http://127.0.0.1:3302

## Production Build
```bash
yarn build
```
Running ```yarn build``` generates an optimized version of your application for production. HTML, CSS, and JavaScript files are created based on your code, it can be deployed and hosted on any web server that can serve HTML/CSS/JS static assets. This includes tools like AWS S3, Nginx, or Apache.


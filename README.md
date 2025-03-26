A content remixer tool using React.

## Features
1. Paste in text we want to remix
2. Click  abutton to apply the remixing we want for it
3. send the requests to an AI api endpoint
4. See the remix in the output box
5. Add other styling and features that we want as we go

## Tech Stack
1. React
2. TailwindCSS
3. Vercel
4. Claude 3.5 Sonnet API

## API Configuration
The project uses the latest Anthropic API (Claude 3.5 Sonnet) with the official JavaScript SDK (@anthropic-ai/sdk).

## Challenges

1. Add in another AI API
2. Add a way to upload audio files to have them transcribed
3. Click to tweet or to schedule a tweet from the output
4. Add a way to save the remixed output to a database

## Setup
1. Clone the repository
2. Run `npm install`
3. Create a `.env.local` file with your Claude API key: `CLAUDE_API_KEY=your_api_key_here`
4. Run `npm run dev` to start the development server

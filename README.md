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

## Tweet Generator

A simple application that uses Claude AI to convert text into tweet-sized chunks.

### Features
- Convert any text into a series of tweets
- Choose from different tweet styles
- Dark mode support
- Save tweets to a database to tweet later
- Responsive design

### Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   CLAUDE_API_KEY=your-claude-api-key
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up Supabase:
   - Create an account at [Supabase](https://supabase.io/)
   - Create a new project
   - Create a new table called `saved_tweets` with the following schema:
     ```sql
     create table saved_tweets (
       id uuid default uuid_generate_v4() primary key,
       content text not null,
       created_at timestamp with time zone default timezone('utc'::text, now()) not null
     );
     ```
   - Copy your Supabase URL and anon key from the API settings page to your `.env.local` file

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Enter or paste text into the input area
2. Select a tweet style
3. Click "Generate Tweet"
4. Use the "Save" button on tweets you want to save for later
5. Click the "Saved Tweets" button in the top-left to view your saved tweets
6. When ready to post a tweet, click the "Tweet" button to open Twitter with the tweet text pre-filled

### Built With

- Next.js
- Tailwind CSS
- Claude AI
- Supabase

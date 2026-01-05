# Wordle Clone

A premium, mobile-first Wordle clone built with **React Native (Expo)** and **Supabase**.

## Features
- 🎮 **Classic Wordle Gameplay**: 6 tries to guess the word using the standard color code.
- ✨ **Rich Aesthetics**: Smooth animations (Flip/Pop), dark mode, and haptic feedback design.
- 🏆 **Leaderboards**: Compete globally or against friends.
- 👥 **Social System**: Add friends and filter rankings.
- 🔒 **Secure**: Powered by Supabase Auth & RLS (Row Level Security).

## Tech Stack
- **Frontend**: React Native, Expo, Reanimated, TypeScript.
- **Backend**: Supabase (PostgreSQL, Auth).

## Getting Started

### Prerequisites
- Node.js
- Expo Go app on your phone.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wordle-clone.git
   cd wordle-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the app:
   ```bash
   npx expo start
   ```

## Database Schema
Authentication and database logic are handled by Supabase.
Run the SQL scripts located in `schema.sql`, `schema_friends.sql`, and `security_fix.sql` in your Supabase SQL Editor to set up the tables and policies.

## License
MIT

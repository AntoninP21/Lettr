-- Create a table for public profiles (optional, but good for leaderboards)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for user statistics
create table public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null unique,
  games_played int default 0,
  games_won int default 0,
  current_streak int default 0,
  max_streak int default 0,
  distribution jsonb default '[0,0,0,0,0,0]'::jsonb, -- Array of 6 integers for 1-6 guesses
  last_played_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_stats enable row level security;

create policy "User stats are viewable by everyone." on public.user_stats
  for select using (true);

create policy "Users can update own stats." on public.user_stats
  for update using (auth.uid() = user_id);

create policy "Users can insert own stats." on public.user_stats
  for insert with check (auth.uid() = user_id);

-- Trigger to create profile and stats on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  
  insert into public.user_stats (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

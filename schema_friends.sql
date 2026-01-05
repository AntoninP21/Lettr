-- Create a table for friendship connections
create table public.friends (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  friend_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id)
);

alter table public.friends enable row level security;

-- Policies
create policy "Users can view their own friendships." on public.friends
  for select using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can create friend requests." on public.friends
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own friendships (accept)." on public.friends
  for update using (auth.uid() = friend_id); -- Only the recipient can accept

-- Simple search function to find users by username (email)
create or replace function public.search_users(search_term text)
returns setof public.profiles as $$
begin
  return query
  select * from public.profiles
  where username ilike search_term || '%'
  limit 10;
end;
$$ language plpgsql security definer;

-- 1. Fix Privacy: Use custom username from metadata, fallback to email prefix
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id, 
    -- Try to get username from metadata, otherwise fall back to email prefix
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  
  insert into public.user_stats (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- 2. Allow users to unfriend or cancel requests (DELETE policy)
create policy "Users can delete their own friendships." on public.friends
  for delete using (auth.uid() = user_id or auth.uid() = friend_id);

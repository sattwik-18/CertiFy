-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create certificates table
create table public.certificates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  organization text,
  title text not null,
  file_url text not null,
  file_hash text not null,
  issued_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.certificates enable row level security;

-- Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Policies for certificates
create policy "Users can view own certificates"
  on public.certificates for select
  using ( auth.uid() = user_id );

create policy "Users can insert own certificates"
  on public.certificates for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own certificates"
  on public.certificates for update
  using ( auth.uid() = user_id );

create policy "Users can delete own certificates"
  on public.certificates for delete
  using ( auth.uid() = user_id );

-- Create storage bucket if not exists (This needs to be done in dashboard usually, but here is policy)
-- Note: You manually need to create a bucket named 'certificates' in Supabase Storage.

-- Storage policies (assuming bucket 'certificates')
-- You typically set this in the Storage-specific policy editor, but can be done via SQL too if supported.
-- Here is a suggestion:
-- create policy "Give users access to own folder 1ok0u3_0" ON storage.objects FOR SELECT TO public USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Easier policy for now for the user to configure in dashboard:
-- "Authenticated users can upload"
-- "Users can read their own files"

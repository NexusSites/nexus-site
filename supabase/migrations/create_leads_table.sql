-- Enable uuid extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create leads table
create table if not exists public.leads (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  phone      text not null,
  email      text not null,
  status     text not null default 'new',
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Allow anyone (anon / public) to INSERT leads only
create policy "Allow public insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Explicitly deny SELECT / UPDATE / DELETE for anon
-- (RLS blocks everything not explicitly allowed, so no extra policies needed)

-- Create verification_events table
create table public.verification_events (
  id uuid primary key default gen_random_uuid(),
  certificate_id uuid references public.certificates(id) on delete set null,
  certificate_hash text not null,
  verifier_user_id uuid references auth.users(id), -- Null if anonymous
  verifier_org_name text, -- e.g. "Public Access" or Organization Name from Profile
  ip_address text,
  geo_country text,
  user_agent text,
  verified_at timestamp with time zone default now(),
  success boolean default true,
  session_id text -- Optional for deduplication
);

-- Enable RLS
alter table public.verification_events enable row level security;

-- Policies

-- 1. Issuers can view events for their own certificates
create policy "Issuers can view verification events for their certs"
  on public.verification_events for select
  using (
    exists (
      select 1 from public.certificates
      where certificates.id = verification_events.certificate_id
      and certificates.user_id = auth.uid()
    )
  );

-- 2. Anyone can INSERT events (Public verification)
create policy "Anyone can insert verification events"
  on public.verification_events for insert
  with check (true);

-- 3. Verifiers can view their own verification history (if logged in)
create policy "Verifiers can view their own history"
  on public.verification_events for select
  using (
    auth.uid() = verifier_user_id
  );

-- Indexes for performance
create index verification_events_cert_id_idx on public.verification_events(certificate_id);
create index verification_events_hash_idx on public.verification_events(certificate_hash);
create index verification_events_user_idx on public.verification_events(verifier_user_id);
create index certificates_hash_idx on public.certificates(file_hash); -- Ensure hash lookup is fast

-- Grant permissions
grant select, insert on public.verification_events to anon, authenticated, service_role;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'agent' check (role in ('admin', 'agent', 'manager')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'outbound' check (type in ('outbound', 'inbound', 'blended')),
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  settings jsonb,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  company text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  state text,
  zip text,
  status text not null default 'new' check (status in ('new', 'contacted', 'interested', 'not_interested', 'callback', 'converted', 'do_not_contact')),
  source text,
  campaign_id uuid references campaigns(id),
  assigned_to uuid references profiles(id),
  tags text[],
  notes text,
  dnc boolean not null default false,
  last_called_at timestamp with time zone,
  call_count int not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists call_scripts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  content text,
  objection_responses jsonb,
  campaign_id uuid references campaigns(id),
  created_by uuid references profiles(id),
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists call_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  user_id uuid references profiles(id),
  campaign_id uuid references campaigns(id),
  direction text not null default 'outbound' check (direction in ('outbound', 'inbound')),
  outcome text not null check (outcome in ('no_answer', 'answered', 'busy', 'voicemail', 'dnc', 'wrong_number', 'disconnected')),
  duration_seconds int not null default 0,
  recording_url text,
  notes text,
  transcript text,
  sip_call_id text,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  user_id uuid not null references profiles(id),
  scheduled_at timestamp with time zone not null,
  duration_minutes int not null default 30,
  type text not null check (type in ('sales_call', 'demo', 'follow_up', 'consultation', 'check_in')),
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists dnc_list (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  reason text,
  source text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default now(),
  unique (phone)
);

create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_phone on leads(phone);
create index if not exists idx_leads_campaign on leads(campaign_id);
create index if not exists idx_leads_assigned on leads(assigned_to);
create index if not exists idx_call_logs_lead on call_logs(lead_id);
create index if not exists idx_call_logs_user on call_logs(user_id);
create index if not exists idx_appointments_lead on appointments(lead_id);
create index if not exists idx_appointments_user on appointments(user_id);
create index if not exists idx_dnc_phone on dnc_list(phone);

create policy "Profiles are viewable by authenticated users" on profiles for select using (auth.role() = 'authenticated');
create policy "Profiles are updatable by the owner or admin" on profiles for update using (auth.uid() = id or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Campaigns are viewable by authenticated users" on campaigns for select using (auth.role() = 'authenticated');
create policy "Campaigns are insertable by authenticated users" on campaigns for insert with check (auth.role() = 'authenticated');
create policy "Campaigns are updatable by the creator or admin" on campaigns for update using (created_by = auth.uid() or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Campaigns are deletable by admin" on campaigns for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Leads are viewable by authenticated users" on leads for select using (auth.role() = 'authenticated');
create policy "Leads are insertable by authenticated users" on leads for insert with check (auth.role() = 'authenticated');
create policy "Leads are updatable by the owner or admin" on leads for update using (assigned_to = auth.uid() or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Call logs are viewable by authenticated users" on call_logs for select using (auth.role() = 'authenticated');
create policy "Call logs are insertable by authenticated users" on call_logs for insert with check (auth.role() = 'authenticated');

create policy "Appointments are viewable by authenticated users" on appointments for select using (auth.role() = 'authenticated');
create policy "Appointments are insertable by authenticated users" on appointments for insert with check (auth.role() = 'authenticated');

create policy "DNC list is viewable by authenticated users" on dnc_list for select using (auth.role() = 'authenticated');
create policy "DNC list is insertable by authenticated users" on dnc_list for insert with check (auth.role() = 'authenticated');

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

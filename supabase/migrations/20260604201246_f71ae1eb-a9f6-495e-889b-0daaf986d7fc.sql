
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create policy "users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Formations
create table public.formations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(10,2) not null default 0,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.formations to anon, authenticated;
grant all on public.formations to service_role;
alter table public.formations enable row level security;

create policy "public read published formations" on public.formations
  for select to anon, authenticated using (published = true or public.has_role(auth.uid(), 'admin'));
create policy "admin insert formations" on public.formations
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "admin update formations" on public.formations
  for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "admin delete formations" on public.formations
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.tg_set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger formations_set_updated_at before update on public.formations
  for each row execute function public.tg_set_updated_at();

-- Images
create table public.formation_images (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references public.formations(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.formation_images to anon, authenticated;
grant all on public.formation_images to service_role;
alter table public.formation_images enable row level security;

create policy "public read formation images" on public.formation_images
  for select to anon, authenticated using (
    exists (select 1 from public.formations f where f.id = formation_id
      and (f.published = true or public.has_role(auth.uid(), 'admin')))
  );
create policy "admin insert formation images" on public.formation_images
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "admin delete formation images" on public.formation_images
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

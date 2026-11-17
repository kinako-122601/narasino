create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 60),
  area text not null check (char_length(btrim(area)) between 1 and 40),
  category text not null check (category in ('大盛り', '食べ放題', 'デカ盛り', 'コスパ')),
  description text not null check (char_length(btrim(description)) between 1 and 180),
  menu text not null default '' check (char_length(menu) <= 60),
  price text not null default '' check (char_length(price) <= 30),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  nickname text not null check (char_length(btrim(nickname)) between 1 and 30),
  rating integer not null check (rating between 1 and 5),
  body text not null check (char_length(btrim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists reviews_shop_id_created_at_idx
  on public.reviews (shop_id, created_at desc);

grant usage on schema public to anon, authenticated;
grant select, insert on public.shops, public.reviews to anon, authenticated;

alter table public.shops enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Anyone can read shops" on public.shops;
create policy "Anyone can read shops"
  on public.shops for select to anon, authenticated
  using (true);

drop policy if exists "Anyone can add shops" on public.shops;
create policy "Anyone can add shops"
  on public.shops for insert to anon, authenticated
  with check (true);

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
  on public.reviews for select to anon, authenticated
  using (true);

drop policy if exists "Anyone can add reviews" on public.reviews;
create policy "Anyone can add reviews"
  on public.reviews for insert to anon, authenticated
  with check (true);

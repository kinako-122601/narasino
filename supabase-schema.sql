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

insert into public.shops (id, name, area, category, description, menu, price)
values
  (
    '00000000-0000-4000-8000-000000000001',
    '二葉海神 第一支店',
    '海神エリア',
    'デカ盛り',
    'カツカレーやカツ丼のボリュームで知られる食堂。普通盛りでも大盛り相当との紹介があります。',
    'カツカレー・カツ丼',
    '1,000円台（参考）'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    '福徳食堂',
    '原木中山エリア',
    '大盛り',
    'ボリュームのある定食が評判。特にチキンカツ定食をがっつり食べたい日に。',
    'チキンカツ定食',
    '1,000円台（参考）'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    '大乃家食堂',
    '船橋市地方卸売市場',
    '大盛り',
    '船橋市場の食堂。海鮮がたっぷりのった丼は、仕入れによってネタが変わるそうです。',
    '海鮮丼',
    '1,000円台（参考）'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'ビッグテキサス 船橋店',
    '船橋本町エリア',
    'デカ盛り',
    'リブステーキはサイズを選べ、最大1kgまで対応との紹介があります。食べる量に合わせて注文できます。',
    'リブステーキ（サイズ選択可）',
    '要確認'
  )
on conflict (id) do nothing;

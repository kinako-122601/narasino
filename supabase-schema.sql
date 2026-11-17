create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 60),
  area text not null check (char_length(btrim(area)) between 1 and 40),
  category text not null check (category in ('大盛り', '食べ放題', 'デカ盛り', 'コスパ')),
  description text not null check (char_length(btrim(description)) between 1 and 180),
  menu text not null default '' check (char_length(menu) <= 60),
  price text not null default '' check (char_length(price) <= 30),
  address text not null default '',
  hours text not null default '',
  phone text not null default '',
  info_url text not null default '',
  created_at timestamptz not null default now()
);

alter table public.shops
  add column if not exists address text not null default '',
  add column if not exists hours text not null default '',
  add column if not exists phone text not null default '',
  add column if not exists info_url text not null default '';

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

insert into public.shops (
  id, name, area, category, description, menu, price, address, hours, phone, info_url
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    '二葉海神 第一支店',
    '海神（東海神駅）',
    'デカ盛り',
    'カツカレーやカツ丼の大盛りが評判の食堂。普通盛りでも大盛り相当との紹介があります。',
    'カツカレー・カツ丼',
    '1,000円台（参考）',
    '千葉県船橋市海神2-14-19',
    '11:30〜15:00／17:00〜19:45（水曜休）',
    '047-422-6611',
    'https://tabelog.com/chiba/A1202/A120201/12022060/'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    '福徳食堂',
    '本中山（原木中山駅）',
    '大盛り',
    'ボリュームのある定食が評判。特にチキンカツ定食をがっつり食べたい日に。',
    'チキンカツ定食',
    '1,000円台（参考）',
    '千葉県船橋市本中山7-7-1 メトロセンター内',
    '11:00〜23:15（定休日なしの情報あり）',
    '047-333-9870',
    'https://tabelog.com/chiba/A1202/A120201/12032352/'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    '大乃家食堂',
    '船橋市地方卸売市場',
    '大盛り',
    '船橋市場の食堂。海鮮がたっぷりのった丼は、仕入れによってネタが変わるそうです。',
    '海鮮丼',
    '1,000円台（参考）',
    '千葉県船橋市市場1-8-1 船橋市地方卸売市場 関連棟7号通路',
    '市場営業日 7:00〜12:30（水・日・祝休の情報あり）',
    '047-423-2489',
    'https://funabashi-ichiba.jp/relation/5125/'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'ビッグテキサス 船橋店',
    '本町（京成船橋駅）',
    'デカ盛り',
    'リブステーキはサイズを選べ、最大1kgまで対応との紹介があります。食べる量に合わせて注文できます。',
    'リブステーキ（サイズ選択可）',
    '要確認',
    '千葉県船橋市本町2-11-12 三善ビル1F',
    '11:30〜15:00／17:00〜23:00（定休日は店舗へ確認）',
    '047-433-0290',
    'https://page.line.me/468ewbak'
  )
on conflict (id) do update set
  name = excluded.name,
  area = excluded.area,
  category = excluded.category,
  description = excluded.description,
  menu = excluded.menu,
  price = excluded.price,
  address = excluded.address,
  hours = excluded.hours,
  phone = excluded.phone,
  info_url = excluded.info_url;

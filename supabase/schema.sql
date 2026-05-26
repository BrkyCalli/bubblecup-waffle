-- ============================================================
-- BUBBLECUP WAFFLE — Faz 2 Veritabanı Şeması
-- Supabase Dashboard → SQL Editor → New query → bu dosyayı yapıştır → Run
-- (Tekrar çalıştırılabilir: tabloları/satırları çoğaltmaz.)
-- ============================================================

-- ----------------------------------------------------------------
-- 1) PROFILES  (kullanıcı profili — auth.users'a bağlı)
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now()
);

-- Yeni kullanıcı kaydolunca otomatik profil satırı aç
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------
-- 2) PRODUCTS  (menü; statik products.ts ile aynı text ID'ler)
-- ----------------------------------------------------------------
create table if not exists public.products (
  id          text primary key,
  name        text not null,
  category    text not null,
  price       numeric not null,
  description text,
  image_path  text,
  is_active   boolean not null default true,
  sort_order  int not null default 0
);

insert into public.products (id, name, category, price, description, image_path, is_active, sort_order) values
  ('bardak-waffle',       'Bardak Waffle',                                              'klasik',  250,  'Tek kişilik, pratik ve doyurucu.',           '/images/products/bardak-waffle.png',       true, 1),
  ('2li-bardak-avantaj',  '2''li Bardak Waffle Avantaj Paketi',                         'ozel',    470,  'İki kişilik keyif, avantajlı fiyatla.',      '/images/products/2li-bardak-avantaj.png',  true, 2),
  ('kova-waffle',         'Kova Waffle',                                                'klasik',  330,  'Bol malzemeli, paylaşmalık kova waffle.',    '/images/products/kova-waffle.png',         true, 3),
  ('2li-kova-avantajli',  '2''li Kova Waffle Avantajlı',                                'klasik',  580,  'İki kova waffle, avantajlı fiyatla.',        '/images/products/2li-kova-avantajli.png',  true, 4),
  ('paylasmali-kova',     'Sevdiklerinle Paylaşmalık Kova Waffle Paketi (3 Kişilik)',  'ozel',    825,  'Üç kişilik dev kova paketi.',                '/images/products/paylasmali-kova.png',     true, 5),
  ('5al4ode',             '5 Al 4 ÖDE!',                                                'sinirsiz', 1200, '5 waffle al, 4 öde! Sınırsız seçim.',        '/images/products/5al4ode.png',             true, 6)
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- 3) ORDERS  (siparişler)
-- ----------------------------------------------------------------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,  -- misafir sipariş için null
  status        text not null default 'pending'
                check (status in ('pending','confirmed','preparing','ready','delivered','cancelled')),
  total         numeric not null default 0,
  notes         text,
  whatsapp_sent boolean not null default false,
  created_at    timestamptz not null default now()
);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- ----------------------------------------------------------------
-- 4) ORDER_ITEMS  (sipariş satırları + kişi bazlı özelleştirme)
-- ----------------------------------------------------------------
create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_id     text references public.products(id),
  quantity       int not null default 1,
  unit_price     numeric not null,
  customizations jsonb not null default '[]'::jsonb  -- PersonSelection[] (çikolata/draje)
);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- ----------------------------------------------------------------
-- 5) ADMIN kontrolü (JWT içindeki e-posta ile)
-- ----------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = any (array['berkaycalli96@gmail.com']);
$$;

-- ----------------------------------------------------------------
-- 6) ROW LEVEL SECURITY
-- ----------------------------------------------------------------
alter table public.profiles    enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- PROFILES: kendi satırını gör/güncelle; admin hepsini görür
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- PRODUCTS: menü herkese açık; yazma yalnız admin
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select using (true);

drop policy if exists products_admin_write on public.products;
create policy products_admin_write on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ORDERS: üye kendi siparişini, admin hepsini; insert üye+misafir; update admin
drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists orders_update on public.orders;
create policy orders_update on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ORDER_ITEMS: bağlı siparişin sahipliğine göre
drop policy if exists order_items_insert on public.order_items;
create policy order_items_insert on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- ----------------------------------------------------------------
-- 7) Rol izinleri (RLS satırları kısıtlar; bunlar işlem iznidir)
-- ----------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select, insert on public.orders to anon, authenticated;
grant update on public.orders to authenticated;
grant select, insert on public.order_items to anon, authenticated;
grant select, update on public.profiles to authenticated;

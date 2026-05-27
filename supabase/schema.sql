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
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,  -- misafir sipariş için null
  status           text not null default 'pending'
                   check (status in ('pending','confirmed','preparing','ready','delivered','cancelled')),
  total            numeric not null default 0,
  notes            text,
  whatsapp_sent    boolean not null default false,
  customer_name    text,    -- sipariş anında girilen ad soyad
  customer_phone   text,    -- sipariş anında girilen telefon
  customer_email   text,    -- sipariş anında girilen e-posta (yorum maili için)
  delivery_address text,    -- teslimat adresi
  delivery_unit    text,    -- daire/kapı no (opsiyonel)
  created_at       timestamptz not null default now()
);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- Mevcut kurulumlar için (orders tablosu çoktan oluştuysa) eksik sütunları ekle:
alter table public.orders add column if not exists customer_name    text;
alter table public.orders add column if not exists customer_phone   text;
alter table public.orders add column if not exists customer_email   text;
alter table public.orders add column if not exists delivery_address text;
alter table public.orders add column if not exists delivery_unit    text;

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

-- ----------------------------------------------------------------
-- 8) SİPARİŞ OLUŞTURMA fonksiyonu (sepet → orders + order_items)
-- ----------------------------------------------------------------
-- security definer: RLS'i güvenle aşar (misafir siparişlerinin alt
-- kalemlerini ekleyebilmek için gerekli). Fiyatları client'tan DEĞİL,
-- products tablosundan okur. Hepsi tek işlemde (atomik) yazılır.
-- p_items biçimi: [{ "product_id": "...", "quantity": 2, "customizations": [...] }, ...]
-- NOT: imza değiştiği için eski sürümleri düşürüyoruz.
drop function if exists public.create_order(jsonb, text);
drop function if exists public.create_order(jsonb, text, text, text, text, text);
create or replace function public.create_order(
  p_items            jsonb,
  p_note             text default null,
  p_customer_name    text default null,
  p_customer_phone   text default null,
  p_delivery_address text default null,
  p_delivery_unit    text default null,
  p_customer_email   text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total    numeric := 0;
  v_item     jsonb;
  v_pid      text;
  v_qty      int;
  v_price    numeric;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Sepet boş';
  end if;

  -- Zorunlu müşteri bilgileri (sunucu tarafı güvence)
  if nullif(trim(coalesce(p_customer_name, '')), '') is null then
    raise exception 'Ad Soyad zorunlu';
  end if;
  if nullif(trim(coalesce(p_customer_phone, '')), '') is null then
    raise exception 'Telefon zorunlu';
  end if;
  if nullif(trim(coalesce(p_delivery_address, '')), '') is null then
    raise exception 'Teslimat adresi zorunlu';
  end if;

  -- Sipariş başlığı (total'i kalemlerden sonra güncelliyoruz)
  insert into public.orders (
    user_id, status, total, notes, whatsapp_sent,
    customer_name, customer_phone, customer_email, delivery_address, delivery_unit
  )
  values (
    auth.uid(),                                  -- üye ise id, misafir ise null
    'pending',
    0,
    nullif(trim(coalesce(p_note, '')), ''),
    true,
    trim(p_customer_name),
    trim(p_customer_phone),
    nullif(trim(coalesce(p_customer_email, '')), ''),
    trim(p_delivery_address),
    nullif(trim(coalesce(p_delivery_unit, '')), '')
  )
  returning id into v_order_id;

  -- Kalemler: fiyat products tablosundan (güvenilir kaynak) alınır
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_pid := v_item ->> 'product_id';
    v_qty := coalesce((v_item ->> 'quantity')::int, 0);

    if v_qty < 1 then
      raise exception 'Geçersiz adet: %', v_qty;
    end if;

    select price into v_price
      from public.products
      where id = v_pid and is_active = true;

    if v_price is null then
      raise exception 'Geçersiz ürün: %', v_pid;
    end if;

    insert into public.order_items (order_id, product_id, quantity, unit_price, customizations)
    values (
      v_order_id,
      v_pid,
      v_qty,
      v_price,
      coalesce(v_item -> 'customizations', '[]'::jsonb)
    );

    v_total := v_total + v_price * v_qty;
  end loop;

  update public.orders set total = v_total where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function public.create_order(jsonb, text, text, text, text, text, text) to anon, authenticated;

-- ----------------------------------------------------------------
-- 9) REVIEWS  (sipariş sonrası yorum/puan sistemi)
-- ----------------------------------------------------------------
-- Akış: cron 2 saati geçmiş siparişlere 'pending' review + token oluşturur →
-- müşteri /yorum/[token]'da doldurur (status 'submitted') → admin onaylar
-- ('approved') → ana sayfada görünür.
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null unique references public.orders(id) on delete cascade,
  token         text not null unique,
  customer_name text,
  email_to      text,          -- yorum maili bu adrese gönderildi
  rating        int check (rating between 1 and 5),
  comment       text,
  status        text not null default 'pending'
                check (status in ('pending','submitted','approved','rejected')),
  created_at    timestamptz not null default now(),
  submitted_at  timestamptz
);
create index if not exists reviews_status_idx on public.reviews(status);
create index if not exists reviews_token_idx on public.reviews(token);

alter table public.reviews enable row level security;

-- Herkes yalnızca ONAYLI yorumları görür (ana sayfa için)
drop policy if exists reviews_public_select on public.reviews;
create policy reviews_public_select on public.reviews
  for select using (status = 'approved');

-- Admin hepsini görür ve günceller (onay/red)
drop policy if exists reviews_admin_all on public.reviews;
create policy reviews_admin_all on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

grant select on public.reviews to anon, authenticated;
grant update on public.reviews to authenticated;   -- admin onayı (RLS admin'e kısıtlar)

-- (a) Cron: 2 saati geçmiş, iptal olmayan, e-postası olan ve henüz review'i
-- olmayan siparişlere 'pending' review + token oluşturur; gönderilecek
-- (token, email, ad) listesini döndürür. Idempotent (tekrar çalışınca çoğaltmaz).
create or replace function public.enqueue_review_emails()
returns table(token text, email_to text, customer_name text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with eligible as (
    insert into public.reviews (order_id, token, customer_name, email_to, status)
    select
      o.id,
      gen_random_uuid()::text,
      o.customer_name,
      o.customer_email,
      'pending'
    from public.orders o
    where o.created_at < now() - interval '2 hours'
      and o.status <> 'cancelled'
      and o.customer_email is not null
      and o.customer_email <> ''
      and not exists (select 1 from public.reviews r where r.order_id = o.id)
    returning reviews.token, reviews.email_to, reviews.customer_name
  )
  select e.token, e.email_to, e.customer_name from eligible e;
end;
$$;

-- (b) Token ile review'i getirir (/yorum/[token] sayfası için)
create or replace function public.get_review_by_token(p_token text)
returns table(status text, rating int, comment text, customer_name text)
language sql
security definer
set search_path = public
as $$
  select r.status, r.rating, r.comment, r.customer_name
  from public.reviews r
  where r.token = p_token;
$$;

-- (c) Müşteri yorumu gönderir (yalnızca 'pending' durumdayken, puan 1-5)
create or replace function public.submit_review(
  p_token   text,
  p_rating  int,
  p_comment text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Puan 1-5 arasında olmalı';
  end if;

  select status into v_status from public.reviews where token = p_token;
  if v_status is null then
    raise exception 'Geçersiz bağlantı';
  end if;
  if v_status <> 'pending' then
    raise exception 'Bu sipariş için zaten yorum yapılmış';
  end if;

  update public.reviews
  set rating = p_rating,
      comment = nullif(trim(coalesce(p_comment, '')), ''),
      status = 'submitted',
      submitted_at = now()
  where token = p_token;
end;
$$;

grant execute on function public.enqueue_review_emails() to anon, authenticated;
grant execute on function public.get_review_by_token(text) to anon, authenticated;
grant execute on function public.submit_review(text, int, text) to anon, authenticated;

-- ----------------------------------------------------------------
-- 10) GOOGLE YORUMLARI  (Google Maps yorumlarını siteye senkronla)
-- ----------------------------------------------------------------
-- Akış: cron Places API (New)'den 4-5 yıldızlı yorumları çeker →
-- upsert_google_review ile 'approved'+'google' olarak kaydeder →
-- ana sayfada site yorumlarıyla birlikte görünür. google_review_id
-- (Google'ın kararlı review 'name'i) ile duplicate engellenir.

-- reviews tablosuna kaynak + google alanları
alter table public.reviews add column if not exists source text not null default 'site'
  check (source in ('site', 'google'));
alter table public.reviews add column if not exists google_review_id text;
alter table public.reviews add column if not exists author_photo text;  -- google profil fotosu URL'i

-- Google yorumlarının order_id / token'ı yoktur → nullable yap.
-- (Mevcut unique kısıtları kalır; PostgreSQL'de birden çok NULL serbesttir.)
alter table public.reviews alter column order_id drop not null;
alter table public.reviews alter column token    drop not null;

-- Aynı Google yorumu iki kez eklenmesin (kısmi unique index)
create unique index if not exists reviews_google_id_idx
  on public.reviews(google_review_id) where google_review_id is not null;

-- Google yorumunu ekler/günceller. Cron anon anahtarıyla çağırır; security
-- definer RLS'i bypass eder. Çakışmada İÇERİK güncellenir ama STATUS'A
-- DOKUNULMAZ — böylece admin bir Google yorumunu reddederse cron geri getirmez.
create or replace function public.upsert_google_review(
  p_google_review_id text,
  p_author           text,
  p_rating           int,
  p_comment          text,
  p_photo            text,
  p_published_at     timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.reviews (
    source, google_review_id, customer_name, rating, comment,
    author_photo, status, submitted_at
  )
  values (
    'google',
    p_google_review_id,
    p_author,
    p_rating,
    nullif(trim(coalesce(p_comment, '')), ''),
    p_photo,
    'approved',
    coalesce(p_published_at, now())
  )
  on conflict (google_review_id) where google_review_id is not null
  do update set
    rating        = excluded.rating,
    comment       = excluded.comment,
    customer_name = excluded.customer_name,
    author_photo  = excluded.author_photo;
end;
$$;

grant execute on function public.upsert_google_review(text, text, int, text, text, timestamptz)
  to anon, authenticated;

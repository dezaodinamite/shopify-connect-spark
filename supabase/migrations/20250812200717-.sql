-- Create a public bucket for site media (videos/images)
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do nothing;

-- Allow public read access to this bucket
create policy "Public read for public-media"
on storage.objects for select
to public
using ( bucket_id = 'public-media' );
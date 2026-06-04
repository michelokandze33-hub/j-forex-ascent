
create policy "public read formation-images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'formation-images');
create policy "admin upload formation-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'formation-images' and public.has_role(auth.uid(), 'admin'));
create policy "admin delete formation-images" on storage.objects
  for delete to authenticated using (bucket_id = 'formation-images' and public.has_role(auth.uid(), 'admin'));

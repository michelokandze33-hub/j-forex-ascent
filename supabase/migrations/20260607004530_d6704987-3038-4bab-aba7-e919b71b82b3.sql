
CREATE POLICY "admin manage marketing-assets" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'marketing-assets' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'marketing-assets' AND public.has_role(auth.uid(), 'admin'));

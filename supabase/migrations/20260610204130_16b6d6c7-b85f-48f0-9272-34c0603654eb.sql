DROP POLICY IF EXISTS "Public can read published lessons" ON public.lessons;
CREATE POLICY "Public can read free published lessons"
ON public.lessons
FOR SELECT
TO anon, authenticated
USING ((published = true AND access = 'free') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update formation images"
ON public.formation_images
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin read leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update formation-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'formation-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'formation-images' AND public.has_role(auth.uid(), 'admin'));
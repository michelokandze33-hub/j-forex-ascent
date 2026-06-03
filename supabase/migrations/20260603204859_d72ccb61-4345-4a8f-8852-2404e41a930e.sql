ALTER TABLE public.leads ADD CONSTRAINT leads_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255);
ALTER TABLE public.leads ADD CONSTRAINT leads_name_length CHECK (name IS NULL OR length(name) <= 100);
ALTER TABLE public.leads ADD CONSTRAINT leads_source_length CHECK (length(source) <= 50);
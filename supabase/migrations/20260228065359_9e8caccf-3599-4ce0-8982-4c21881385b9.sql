
-- Create storage bucket for resume uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Allow anyone to upload resumes (no auth required for now)
CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- Allow anyone to read resumes (for the edge function)
CREATE POLICY "Anyone can read resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- Allow anyone to delete resumes
CREATE POLICY "Anyone can delete resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes');

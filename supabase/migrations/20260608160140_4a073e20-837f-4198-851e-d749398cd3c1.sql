
-- Lock down trigger-only helper functions
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten storage policies on event-assets
DROP POLICY IF EXISTS "Anyone can view event assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload event assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own event assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own event assets" ON storage.objects;

-- SELECT (listing) only for owner of folder. Public file URLs still work because bucket is public.
CREATE POLICY "Owners can list their event assets"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'event-assets'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- INSERT only into the user's own folder
CREATE POLICY "Users can upload to their own event-assets folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-assets'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- UPDATE only inside their own folder
CREATE POLICY "Users can update their own event assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-assets'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'event-assets'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- DELETE only inside their own folder
CREATE POLICY "Users can delete their own event assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-assets'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

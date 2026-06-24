-- Update payment_status constraint to include 'partial'
DO $$
DECLARE
    const_name text;
BEGIN
    SELECT conname INTO const_name
    FROM pg_constraint
    WHERE conrelid = 'public.enrollments'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%payment_status%';
    
    IF const_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.enrollments DROP CONSTRAINT ' || const_name;
    END IF;
END $$;
ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_payment_status_check CHECK (payment_status in ('pending', 'partial', 'paid', 'waived', 'refunded'));

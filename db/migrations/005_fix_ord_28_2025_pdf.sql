-- Restore the PDF link for Ordinance 28-2025.
-- Migration: 005_fix_ord_28_2025_pdf.sql
--
-- 004_taguig_seed.sql was applied to production before this link was
-- confirmed working (2026-10-28), so update the existing row here.
UPDATE documents
SET pdf_url = 'https://sp.taguig.gov.ph/pdf/codified/rc/Ord.28-2025.pdf',
    canonical_notes = NULL,
    updated_at = datetime('now')
WHERE id = 'ordinance_2025-028';

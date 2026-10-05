/** Shape of src/data/directory/barangays.json (see schema/barangays.schema.json). */

export interface BarangayOfficial {
  role: string;
  name: string;
}

export interface Barangay {
  slug: string;
  barangay_name: string;
  address?: string;
  trunkline?: string[];
  website?: string | null;
  email?: string | null;
  /** Roles currently vacant whose successor is not yet listed. */
  vacancies?: string[];
  officials?: BarangayOfficial[];
}

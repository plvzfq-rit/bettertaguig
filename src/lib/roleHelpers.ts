/**
 * Helper functions to identify role types in the legislation system.
 * These functions determine whether a membership/role is executive or legislative.
 */

/**
 * Checks if a chamber value represents an executive role.
 * @param chamber - The chamber identifier (e.g., 'executive', 'sangguniang-panlungsod')
 * @returns true if the role is executive
 */
export function isExecutiveRole(chamber?: string): boolean {
  return chamber === 'executive';
}

/**
 * Checks if a chamber value represents a legislative role.
 * @param chamber - The chamber identifier (e.g., 'executive', 'sangguniang-panlungsod')
 * @returns true if the role is legislative (the local Sanggunian)
 */
export function isLegislativeRole(chamber?: string): boolean {
  return (
    chamber === 'sangguniang-bayan' || // municipal council
    chamber === 'sangguniang-panlungsod' || // city council
    chamber === 'sangguniang-panlalawigan' // provincial board
  );
}

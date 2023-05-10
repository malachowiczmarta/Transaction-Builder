export default function isValidENSName(name: string): boolean {
  // Check that the name is not empty or too long
  if (name.trim() === '' || name.length > 253) {
    return false;
  }

  // Split the name into parts using the '.' separator
  const parts = name.split('.');
  const numParts = parts.length;

  // Check that the name has at least two parts, and that each part is not too long
  if (numParts < 2 || parts.some((part) => part.length > 63)) {
    return false;
  }

  // Check that the first part is not empty or too long
  const firstPart = parts[0];
  if (firstPart.trim() === '' || firstPart.length > 63) {
    return false;
  }

  // Check that the last part is a valid TLD (top-level domain)
  const lastPart = parts[numParts - 1];
  const tldRegex = /^[a-z]{2,}$/i;
  if (!tldRegex.test(lastPart)) {
    return false;
  }

  // Check that all other parts are valid labels (lowercase alphanumeric or hyphen, not starting or ending with a hyphen)
  const labelRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  for (let i = 1; i < numParts - 1; i++) {
    const label = parts[i];
    if (!labelRegex.test(label)) {
      return false;
    }
  }

  // All checks passed, name is valid
  return true;
}

/**
 * Input validation and sanitization utilities for Keen-Keeper
 */

/**
 * Trims leading and trailing whitespace from string input.
 * @param {*} val - The input value to sanitize.
 * @returns {string} Sanitized string or empty string if not a string.
 */
export function sanitizeString(val) {
  if (typeof val !== "string") return "";
  return val.trim();
}

/**
 * Validates whether string is a well-formed email address.
 * @param {string} [email] - Optional email address to validate.
 * @returns {boolean} True if empty or valid email syntax.
 */
export function isValidEmail(email) {
  if (!email) return true; // email is optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validateFriendInput(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    const name = sanitizeString(data.name);
    if (!name) {
      errors.push("Friend name is required and cannot be blank.");
    } else if (name.length > 100) {
      errors.push("Friend name cannot exceed 100 characters.");
    }
  }

  if (data.picture !== undefined && data.picture !== "") {
    if (!isValidUrl(data.picture)) {
      errors.push("Invalid avatar picture URL format.");
    }
  }

  if (data.email !== undefined && data.email !== "") {
    if (!isValidEmail(data.email)) {
      errors.push("Invalid email address format.");
    }
  }

  if (data.goal !== undefined) {
    const goalNum = parseInt(data.goal, 10);
    if (isNaN(goalNum) || goalNum < 1 || goalNum > 365) {
      errors.push("Cadence goal must be an integer between 1 and 365 days.");
    }
  }

  if (data.days_since_contact !== undefined) {
    const days = Number(data.days_since_contact);
    if (isNaN(days) || days < 0) {
      errors.push("Days since contact cannot be negative.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates activity touchpoint input payload.
 * @param {object} data - Activity payload to validate.
 * @returns {{isValid: boolean, errors: string[]}} Validation result object.
 */
export function validateActivityInput(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Activity payload must be a valid object.");
    return { isValid: false, errors };
  }
  if (!data.type || !String(data.type).trim()) {
    errors.push("Activity type is required.");
  }
  if (data.duration !== undefined && data.duration !== null && data.duration !== "") {
    const dur = Number(data.duration);
    if (isNaN(dur) || dur < 0) {
      errors.push("Duration must be a positive number.");
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates phone number string format.
 * @param {string} [phone] - Optional phone string.
 * @returns {boolean} True if empty or valid phone.
 */
export function isValidPhone(phone) {
  if (!phone) return true;
  const cleaned = String(phone).replace(/[\s\-\(\)\+]/g, "");
  return cleaned.length >= 7 && cleaned.length <= 15 && /^\d+$/.test(cleaned);
}

/**
 * Validates if a date string conforms to YYYY-MM-DD or valid ISO date.
 * @param {string} [dateStr] - Date string to test.
 * @returns {boolean} True if valid date representation.
 */
export function isValidDateString(dateStr) {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

/**
 * Validates whether string is a valid web URL.
 * @param {string} [url] - URL string to check.
 * @returns {boolean} True if empty or valid HTTP/HTTPS URL.
 */
export function isValidUrl(url) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Input validation and sanitization utilities for Keen-Keeper
 */

export function sanitizeString(val) {
  if (typeof val !== "string") return "";
  return val.trim();
}

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

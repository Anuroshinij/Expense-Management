// Email regex
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Password: >6 chars, must include:
// uppercase, lowercase, number, special char
export const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{7,}$/.test(password);

// Main validation
export const validateAuth = (data, isLogin) => {
  const errors = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  if (!isLogin) {
    if (!data.name) {
      errors.name = "Name is required";
    }

    if (!isStrongPassword(data.password)) {
      errors.password =
        "Min 7 chars with A-Z, a-z, number & special symbol";
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};
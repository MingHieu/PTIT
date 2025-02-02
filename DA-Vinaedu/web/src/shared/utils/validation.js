export const validatePassword = password => {
  // Regex for password validation: at least 6 characters, 1 uppercase, 1 number, 1 special character
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;,.<>?]).{6,}$/;
  return regex.test(password);
};

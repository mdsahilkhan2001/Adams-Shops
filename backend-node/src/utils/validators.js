import validator from "validator";

export const isValidEmail = (value) => validator.isEmail(value || "");

export const isValidPhone = (value) =>
  validator.isMobilePhone(value || "", ["en-IN", "en-US"], { strictMode: false });

export const isStrongPassword = (value) =>
  validator.isStrongPassword(value || "", {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  });

export const isValidPasswordMatch = (password, confirmPassword) => password === confirmPassword;

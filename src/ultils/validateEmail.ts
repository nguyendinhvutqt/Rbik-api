const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

export const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};

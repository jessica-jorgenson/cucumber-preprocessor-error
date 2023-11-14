const base = Cypress.env("urls").main;

export const getPage = () => {
  return base.replace("bing", "google");
};

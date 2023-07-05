export const logger = () => (next) => (action) => {
  process.env.NODE_ENV === "development" && console.log(action);
  next(action);
};

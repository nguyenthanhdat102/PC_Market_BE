export default (min = 1500, max = 3500) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

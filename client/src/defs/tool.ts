export const randomString = () => {
  return Math.random().toString(36).slice(-8) + '_' + Date.now() + '_' + Math.random().toString(36).slice(-8);
};

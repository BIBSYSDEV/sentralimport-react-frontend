module.exports = (on, config) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@cypress/code-coverage/task')(on, config);
  return config;
};

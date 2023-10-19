module.exports = {
  apps: [
    {
      name: `wcrs`,
      script: 'yarn run start:prod',
      log: '/dev/null',
      error: '/dev/null',
    },
  ],
};

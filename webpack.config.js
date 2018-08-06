var config = require('./webpack.config.full');

// return only client config for dev server with HMR
module.exports = (env, argv) => config(env, argv)[0];

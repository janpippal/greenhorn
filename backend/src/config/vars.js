const dev = {
  url: 'http://dev.frontend.team08.vse.handson.pro'
};

const local = {
  url: 'http://localhost:3000'
};

const devjan = {
  url: 'http://dev.frontend.xpipj04.vse.handson.pro'
};

const config = process.env.ENVIRONMENT === 'local '
  ? local
  : process.env.ENVIRONMENT === 'dev ' ? dev : devjan;

export default {
  ...config
};

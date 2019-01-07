const local = {
    url: "localhost:3000",
    backendUrl: "localhost:3030"
};

const dev = {
    url: "http://dev.frontend.team08.vse.handson.pro",
    backendUrl: "http://dev.backend.team08.vse.handson.pro"
};

const prod = {
  url: "http://frontend.team08.vse.handson.pro",
  backendUrl: "http://backend.team08.vse.handson.pro"
};

const config = process.env.REACT_APP_STAGE === 'production'
  ? prod
  : process.env.REACT_APP_STAGE === 'development' ? dev : local ;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};

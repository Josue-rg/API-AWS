const ENV = process.env.NODE_ENV || "production";

const BACKEND_URLS = {
  production: "https://c9my416xy0.execute-api.us-east-1.amazonaws.com",
};

const URL_BACKEND = BACKEND_URLS[ENV];

export { URL_BACKEND };

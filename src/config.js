module.exports = {
  dev: process.env.NODE_ENV !== "production",
  appPath: process.env.NODE_ENV === "production" ? "./build/app" : "./src",
  enableSPARouting: process.env.ENABLE_SPA_ROUTING === "true",
  enableRedirects: process.env.ENABLE_REDIRECTS === "true"
};


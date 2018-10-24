module.exports = {
  dev: process.env.NODE_ENV !== "production",
  appPath: process.env.NODE_ENV === "production" ? "./build/app" : "./src",
  enableRedirects: process.env.ENABLE_REDIRECTS === "true"
};


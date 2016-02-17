function contextFrom(env) {
  return {
    environment: process.env.ENVIRONMENT,
    appId: process.env.APP_ID,
    clientId: process.env.CLIENT_ID,
    secretId: process.env.CLIENT_SECRET,
    appSignature: process.env.APP_SIGNATURE,
    authUrl: process.env.AUTH_URL,
    voucherApiUrl: process.env.VOUCHER_API_URL
  };
}

module.exports = contextFrom;

export const environment = {
  production: true,
  auth0: {
    domain: '${firebaseConfig.auth0.domain}',
    clientId: '${firebaseConfig.auth0.clientid}',
    database: '${firebaseConfig.auth0.database}',
    audience: '${firebaseConfig.auth0.audience}'
  },
  apiUrl: '${firebaseConfig.api.url}',
  paymentUrl: '${firebaseConfig.payment.url}'
};


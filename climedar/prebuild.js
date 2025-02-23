const fs = require('fs');

// Obtén las variables de entorno de GitHub Actions
const envConfig = `
export const environment = {
  production: true,
  auth0: {
    domain: '${process.env.AUTH0_DOMAIN}',
    clientId: '${process.env.AUTH0_CLIENT_ID}',
    database: '${process.env.AUTH0_DATABASE}',
    audience: '${process.env.AUTH0_AUDIENCE}'
  },
  apiUrl: '${process.env.API_URL}',
  paymentUrl: '${process.env.PAYMENT_URL}'
};
`;

// Escribe el archivo environment.prod.ts
fs.writeFileSync('src/environments/environment.prod.ts', envConfig);
console.log('✅ environment.prod.ts generado con variables de entorno');

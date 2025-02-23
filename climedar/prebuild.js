const fs = require('fs');
const path = require('path');

// Obtén la ruta absoluta al directorio environments
const envDir = path.join(__dirname, 'src/app/environments');
const envFile = path.join(envDir, '/environment.prod.ts');

// Crea el directorio si no existe
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Genera el contenido del archivo de entorno
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
fs.writeFileSync(envFile, envConfig);
console.log('✅ environment.prod.ts generado con variables de entorno');

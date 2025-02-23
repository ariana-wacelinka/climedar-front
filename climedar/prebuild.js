const fs = require('fs');
const { exec } = require('child_process');

// Ejecuta el comando para obtener las variables de Firebase
exec('firebase functions:config:get', (err, stdout) => {
  if (err) {
    console.error('❌ Error al obtener las variables de Firebase:', err);
    return;
  }

  // Parsear la respuesta JSON
  const firebaseConfig = JSON.parse(stdout);

  // Generar el archivo environment.prod.ts con las variables
  const envConfig = `
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
`;

if (!fs.existsSync('src/environments/environment.prod.ts')) {
    fs.writeFileSync('src/environments/environment.prod.ts', envConfig);
    console.log('✅ environment.prod.ts generado con variables de Firebase');
} else {
    console.log('❌ environment.prod.ts ya existe');
}
});
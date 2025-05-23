const { writeFile, existsSync, mkdirSync } = require('fs');
const { argv } = require('yargs');
const dotenv = require('dotenv');

dotenv.config();
const environment = argv.environment;

const writeFileUsingFs = (targetPath, environmentFileContent) => {
  writeFile(targetPath, environmentFileContent, (err) => {
    if (err) console.log(err);
    if (environmentFileContent !== '')
      console.log(`Wrote variables to ${targetPath}`);
  });
};

const envDirectory = './src/app/environments';
// CREATES THE `environments` DIRECTORY IF IT DOESN'T EXIST
if (!existsSync(envDirectory)) mkdirSync(envDirectory);
// CREATES THE `environment.prod.ts` AND `environment.ts` FILE IF IT DOESN'T EXIST
const envProductionPath = `${envDirectory}/environment.prod.ts`;
const envDevelopmentPath = `${envDirectory}/environment.ts`;
writeFileUsingFs(envProductionPath, '');
writeFileUsingFs(envDevelopmentPath, '');

// CHECKS WHETHER COMMAND LINE ARGUMENT OF 'prod' WAS PROVIDED SIGNIFYING PRODUCTION MODE
const isProduction = environment === 'prod';
const environmentFileContent = `// This file was autogenerated by dynamically running setEnv.ts and using dotenv for managing API key secrecy
export const environment = {
  production: ${isProduction},
  auth0: {
    domain: '${process.env.AUTH0_DOMAIN}',
    clientId: '${process.env.AUTH0_CLIENT_ID}',
    database: '${process.env.AUTH0_DATABASE}',
    audience: '${process.env.AUTH0_AUDIENCE}',
  },
  apiUrl: '${process.env.API_URL}',
  paymentUrl: '${process.env.PAYMENT_URL}',
};
`;
// IT IS COPIED INTO BOTH FILES TO PREVENT THE COMPILER COMPLAINS
writeFileUsingFs(envProductionPath, environmentFileContent);
writeFileUsingFs(envDevelopmentPath, environmentFileContent);
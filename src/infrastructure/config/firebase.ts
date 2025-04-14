import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

let serviceAccount;

try {
  const serviceAccountPath = path.join(__dirname, '../../../serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
  } else {
    throw new Error('serviceAccountKey.json not found');
  }
} catch (error) {
  console.log('Using environment variables for Firebase configuration');
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export const db = admin.firestore(); 
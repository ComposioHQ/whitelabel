import admin from 'firebase-admin';
import { getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

config(); // Load environment variables

class FirebaseService {
  constructor() {
    this._initialize();
  }

  _initialize() {
    const creds = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    if (!getApps().length) {
      initializeApp({
        credential: admin.credential.cert(creds),
      });
    }

    this.db = getFirestore();
  }

  async getUserByUsername(username) {
    const usersRef = this.db.collection('users');
    const query = usersRef.where('uid', '==', username).limit(1);
    const snapshot = await query.get();

    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }

    return false;
  }

//   async updateTwitterIntegrationId(username, twitterIntegrationId) {
//     const usersRef = this.db.collection('users');
//     const query = usersRef.where('username', '==', username).limit(1);
//     const snapshot = await query.get();

//     if (!snapshot.empty) {
//       try {
//         await snapshot.docs[0].ref.update({ twitterIntegrationId });
//         console.log(`Successfully updated twitterIntegrationId for user ${username}`);
//         return true;
//       } catch (e) {
//         console.error(`Error updating twitterIntegrationId for user ${username}: ${e}`);
//         return false;
//       }
//     }

//     console.log(`User ${username} not found`);
//     return false;
//   }

//   async getTwitterIntegrationId(username) {
//     const usersRef = this.db.collection('users');
//     const query = usersRef.where('username', '==', username).limit(1);
//     const snapshot = await query.get();

//     if (!snapshot.empty) {
//       const userData = snapshot.docs[0].data();
//       return userData.twitterIntegrationId || '';
//     }

//     console.log(`User ${username} not found`);
//     return '';
//   }

//   async getComposioApiKey(username) {
//     const usersRef = this.db.collection('users');
//     const query = usersRef.where('username', '==', username).limit(1);
//     const snapshot = await query.get();

//     if (!snapshot.empty) {
//       const userData = snapshot.docs[0].data();
//       return userData.composio_api_key || '';
//     }

//     console.log(`User ${username} not found`);
//     return '';
//   }

//   async checkComposioApiKey(username) {
//     const usersRef = this.db.collection('users');
//     const query = usersRef.where('username', '==', username).limit(1);
//     const snapshot = await query.get();

//     if (!snapshot.empty) {
//       const userData = snapshot.docs[0].data();
//       return !!userData.composio_api_key;
//     }

//     return false;
//   }
}

// Export a singleton instance
const firebaseService = new FirebaseService();

// Example of a simple operation to get all usernames
async function getAllUsernames() {
  const usersRef = firebaseService.db.collection('users');
  const snapshot = await usersRef.get();
  return snapshot.docs.map(doc => doc.data().username);
}

export { firebaseService as default, getAllUsernames };

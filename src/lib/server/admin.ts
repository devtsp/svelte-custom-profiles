import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import {
	FB_CLIENT_EMAIL,
	FB_PRIVATE_KEY,
	FB_PROJECT_ID,
} from '$env/static/private';
import pkg from 'firebase-admin';

// wrap in trycatch bcause in development it may try to initialize the
// firebase app more than once which will cause an error
try {
	pkg.initializeApp({
		credential: pkg.credential.cert({
			projectId: FB_PROJECT_ID,
			clientEmail: FB_CLIENT_EMAIL,
			privateKey: FB_PRIVATE_KEY,
		}),
	});
} catch (error: any) {
	if (!/already exists/u.test(error.message)) {
		// Log error only if is not was explained above
		console.error('Firebase admin error: ', error.stack);
	}
}

// Prefix "admin" to variables to distinguish them from the client SDK
export const adminDB = getFirestore();
export const adminAuth = getAuth();

import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { derived, writable, type Readable } from 'svelte/store';

const firebaseConfig = {
	apiKey: 'AIzaSyAZ_4i1lHDqe1rkvTm8fCUaokp_jq4syRY',
	authDomain: 'svelte-custom-profiles.firebaseapp.com',
	projectId: 'svelte-custom-profiles',
	storageBucket: 'svelte-custom-profiles.appspot.com',
	messagingSenderId: '871512424269',
	appId: '1:871512424269:web:0e99604f0f57c93bb14104',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return { subscribe };
	}

	const { subscribe } = writable(auth.currentUser ?? null, set => {
		unsubscribe = onAuthStateChanged(auth, user => {
			set(user);
		});

		return () => unsubscribe();
	});

	return {
		subscribe,
	};
}

/**
 * Reusable function to subscribe to different firestore collections
 * @param path a path to the resource
 * @returns a store with  realtime updates on document data
 */
function docStore<T>(path: string) {
	let unsubscribe: () => void;
	const docRef = doc(db, path);
	const { subscribe } = writable<T | null>(null, set => {
		unsubscribe = onSnapshot(docRef, snapshot => {
			set((snapshot.data() as T) ?? null);
		});
		return () => unsubscribe();
	});
	return {
		subscribe,
		ref: docRef,
		id: docRef.id,
	};
}

const user = userStore();

interface UserData {
	username: string;
	bio: string;
	photoURL: string;
	links: any[];
}

// Combine already created user store with derived svelte method
const userData: Readable<UserData | null> = derived(user, ($user, set) => {
	// If user's logged in return subscription to another store holding user info in the cloud
	if ($user) {
		return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
	} else {
		set(null);
	}
});

export { user, userData, docStore };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable } from 'svelte/store';

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

export const user = userStore();

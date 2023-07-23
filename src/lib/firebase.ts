import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyAZ_4i1lHDqe1rkvTm8fCUaokp_jq4syRY',
	authDomain: 'svelte-custom-profiles.firebaseapp.com',
	projectId: 'svelte-custom-profiles',
	storageBucket: 'svelte-custom-profiles.appspot.com',
	messagingSenderId: '871512424269',
	appId: '1:871512424269:web:0e99604f0f57c93bb14104',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

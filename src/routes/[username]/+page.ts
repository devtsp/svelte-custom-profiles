import { error } from '@sveltejs/kit';
import {
	collection,
	getDocs,
	limit,
	query,
	where,
	doc,
	getDoc,
} from 'firebase/firestore';
import type { PageLoad } from './$types';

import { db } from '$lib/firebase';

export const load = (async ({ params }) => {
	const collectionRef = collection(db, 'users');
	const q = query(
		collectionRef,
		where('username', '==', params.username),
		limit(1)
	);
	const snapshot = await getDocs(q);
	const exists = snapshot.docs[0]?.exists();

	if (!exists) {
		throw error(404, "User doesn't exist");
	}

	const data = snapshot.docs[0]?.data();

	if (!data.published) {
		throw error(403, `The profile of @${data.username} is not public.`);
	}

	const usernameResult = await getDoc(doc(db, 'usernames', params.username));
	const { uid } = usernameResult.data() as { uid: string };

	return {
		username: data.username,
		photoURL: data.photoURL,
		bio: data.bio,
		links: data.links ?? [],
		uid,
	};
}) satisfies PageLoad;

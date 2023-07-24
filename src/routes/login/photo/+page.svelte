<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { user, userData, storage, db } from '$lib/firebase';
	import { doc, updateDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

	let previewURL: string;
	let uploading = false;

	async function upload(e: any) {
		uploading = true;
		const file = e.target.files[0];
		previewURL = URL.createObjectURL(file);
		// create path where file will we saved
		const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
		// upload photo
		const result = await uploadBytes(storageRef, file);
		// get url of saved photo
		const url = await getDownloadURL(result.ref);
		// save the url on the user document on db
		await updateDoc(doc(db, 'users', $user!.uid), { photoURL: url });
		uploading = false;
	}
</script>

<AuthCheck>
	<h2>Upload a Profile Photo</h2>
	<form>
		<div>
			<img
				src={previewURL ?? $userData?.photoURL ?? '/user.jpg'}
				alt="user"
				width="100%"
			/>
			{#if !uploading}
				<label for="photoURL" class="label mt-2">
					<span class="label-text">Pick a file</span>
				</label>
				<input
					type="file"
					name="photoURL"
					accept="img/png, img/jpeg, image/gif, image/webp"
					on:change={upload}
					class="file-input file-input-sm w-full"
				/>
			{/if}
			{#if uploading}
				<p class="mt-5">Uploading...</p>
				<progress class="progress progress-info" />
			{/if}
		</div>
	</form>
</AuthCheck>

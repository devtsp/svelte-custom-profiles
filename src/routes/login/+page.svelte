<script lang="ts">
	import { auth, user } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(auth, provider);
		const idToken = await credential.user.getIdToken();
		const res = await fetch('/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ idToken }),
		});
	}

	async function signOutSSR() {
		const res = await fetch('/api/signin', {
			method: 'DELETE',
		});
		await signOut(auth);
	}
</script>

{#if $user}
	<h2 class="">
		<span>Welcome, </span> <br />
		<span class="text-2xl font-bold">
			{$user.displayName}
		</span>
	</h2>
	<p class="text-center text-success mt-3">You are logged in</p>
	<button
		class="btn btn-sm btn-outline btn-error mt-5"
		on:click={() => signOut(auth)}>Sign out</button
	>
{:else}
	<button class="btn btn-sm btn-outline btn-info" on:click={signInWithGoogle}
		>Sign in with Google</button
	>
{/if}

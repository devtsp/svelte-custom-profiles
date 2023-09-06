<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { db, user, userData } from '$lib/firebase';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';

	let username = '';
	let loading = false;
	let isAvailable = false;

	let debounceTimer: NodeJS.Timeout;

	const usernameRegex = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

	$: isValid =
		username?.length > 2 &&
		username.length < 16 &&
		usernameRegex.test(username);
	$: isTouched = username.length > 0;
	$: isTaken = isValid && !isAvailable && !loading;

	async function checkAvailability() {
		if (!isValid) {
			return;
		}
		clearTimeout(debounceTimer);
		isAvailable = true;
		loading = true;
		debounceTimer = setTimeout(async () => {
			try {
				const ref = doc(db, 'usernames', username);
				const exists = await getDoc(ref).then(doc => doc.exists());
				isAvailable = !exists;
			} catch (error) {
				console.error(error);
			} finally {
				loading = false;
			}
		}, 500);
	}

	async function confirmUsername() {
		// batch is like a SQL transaction
		const batch = writeBatch(db);
		batch.set(doc(db, 'usernames', username), { uid: $user?.uid });
		batch.set(doc(db, 'users', $user!.uid), {
			username,
			photoURL: $user?.photoURL ?? null,
			published: true,
			bio: 'Insert bio',
			links: [
				{
					title: 'Test link',
					url: 'https://youtube.com',
					icon: 'custom',
				},
			],
		});
		await batch.commit();
	}
</script>

<AuthCheck>
	{#if $userData?.username}
		<p class="text-xl">
			Your username is <br />
			<span class="text-4xl font-bold text-accent">@{$userData.username}</span>
		</p>
		<p class="my-4">(Username cannot be changed)</p>
		<a href="/login/photo" class="link-accent underline">Upload Profile Image</a
		>
	{:else}
		<form on:submit|preventDefault={confirmUsername} class="w-full">
			<input
				type="text"
				placeholder="Username"
				bind:value={username}
				on:input={checkAvailability}
				class="input input-sm w-full"
				class:input-error={!isValid && isTouched}
				class:input-warning={isTaken}
			/>

			{#if !isValid && isTouched}
				<p class="text-error text-sm mt-5">
					Must be 3-16 characters long, alphanumeric only
				</p>
			{/if}

			{#if loading}
				<p class="text-warning text-sm mt-5">Checking availability...</p>
			{/if}

			{#if !loading && isValid && isAvailable}
				<p class="text-4xl mt-5">@{username}</p>
				<button class="btn btn-outline btn-accent btn-sm mt-5 w-full"
					>Confirm username</button
				>
			{/if}
		</form>
	{/if}
</AuthCheck>

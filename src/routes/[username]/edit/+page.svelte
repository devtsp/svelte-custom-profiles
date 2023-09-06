<script lang="ts">
	import { page } from '$app/stores';
	import UserLink from '$lib/components/UserLink.svelte';
	import SortableList from '$lib/components/SortableList.svelte';
	import { db, userData, user } from '$lib/firebase';
	import {
		arrayRemove,
		arrayUnion,
		doc,
		setDoc,
		updateDoc,
	} from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import { PUBLIC_PAGE } from '$env/static/public';

	function sortList(e: CustomEvent) {
		const newList = e.detail;
		const userRef = doc(db, 'users', $user!.uid);
		setDoc(userRef, { links: newList }, { merge: true });
	}

	const icons = ['YouTube', 'LinkedIn', 'GitHub', 'Custom'];

	// kinda state?
	let showForm = false;

	// store defaults
	const formDefaults = {
		icon: 'Custom',
		title: '',
		url: '',
	};

	// form store
	const formData = writable(formDefaults);

	// form input validations
	$: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
	$: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
	$: formIsValid = urlIsValid && titleIsValid;

	async function addLink(e: SubmitEvent) {
		const userRef = doc(db, 'users', $user!.uid);
		await updateDoc(userRef, {
			links: arrayUnion({
				...$formData,
				id: Date.now().toString(),
			}),
		});
		formData.set({
			icon: '',
			title: '',
			url: '',
		});
	}

	async function deleteLink(item: any) {
		const userRef = doc(db, 'users', $user!.uid);
		await updateDoc(userRef, {
			links: arrayRemove(item),
		});
	}
</script>

<main class="max-w-xl mx-auto my-2">
	{#if $userData?.username == $page.params.username}
		<a
			class="link link-hover text-accent block text-2xl text-center my-4"
			href={`${PUBLIC_PAGE}/${$userData.username}/bio`}
		>
			Edit Bio 🖊
		</a>

		<h2 class="text-center text-lg mb-1 mt-3">Add a new link:</h2>
		<form
			on:submit|preventDefault={addLink}
			class="bg-base-200 p-3 w-full mx-auto rounded-xl"
		>
			<div class="flex flex-col gap-3">
				<!-- icon for the link -->
				<select
					name="icon"
					class="select select-sm rounded"
					bind:value={$formData.icon}
				>
					{#each icons as icon}
						<option value={icon}>{icon}</option>
					{/each}
				</select>

				<!-- title -->
				<input
					name="title"
					type="text"
					placeholder="Title"
					class="input input-sm rounded"
					bind:value={$formData.title}
				/>

				<!-- link -->
				<input
					name="url"
					type="text"
					placeholder="URL"
					class="input input-sm rounded"
					bind:value={$formData.url}
				/>
			</div>

			<!-- form errors -->
			<div class="my-2 text-center text-md">
				{#if !titleIsValid}
					<p class="text-error">Must have valid title</p>
				{/if}
				{#if !urlIsValid}
					<p class="text-error">Must have a valid URL</p>
				{/if}
			</div>

			<button
				disabled={!formIsValid}
				type="submit"
				class="btn btn-sm btn-success grow rounded w-full">Add Link</button
			>
		</form>

		<h2 class="text-center text-lg mb-1 mt-3">
			Modify links order (drag-and-drop):
		</h2>

		<SortableList list={$userData?.links} on:sort={sortList} let:item let:index>
			<div class="group relative">
				<UserLink {...item} />
				<button
					on:click={() => deleteLink(item)}
					class="btn btn-xs btn-error invisible group-hover:visible transition-all absolute -right-6 bottom-10"
					>Delete</button
				>
			</div>
		</SortableList>
	{/if}
</main>

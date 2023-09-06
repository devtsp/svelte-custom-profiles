<script lang="ts">
	import { user } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	import UserLink from '$lib/components/UserLink.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>@{data.username} Links</title>
	<meta name="description" content={data.bio} />
</svelte:head>

<main class="prose text-center mx-auto mt-2 w-[500px]">
	{#if data.uid === $user?.uid}
		<button
			class="btn btn-sm btn-neutral btn-outline my-3 rounded w-40"
			on:click={() => goto(`/${data.username}/edit`)}>(edit profile)</button
		>
	{/if}

	<img
		src={data.photoURL ?? '/user.png'}
		alt="photoURL"
		width="256"
		class="mx-auto mt-6"
	/>
	<div class="my-12">
		<h1 class="text-5xl text-orange-600 font-bold">
			@{data.username}
		</h1>
		<p class="text-xl">{data.bio ?? 'no bio yet...'}</p>
	</div>
	<ul class="list-none flex flex-col gap-[8px] mt-8">
		{#each data.links as { icon, url, title }}
			<li>
				<UserLink {...{ icon, url, title }} />
			</li>
		{/each}
	</ul>
</main>

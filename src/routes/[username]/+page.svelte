<script lang="ts">
	import UserLink from '$lib/components/UserLink.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>@{data.username} Links</title>
	<meta name="description" content={data.bio} />
</svelte:head>

<main class="prose text-center mx-auto mt-8">
	<h1 class="text-3xl text-lime-600 my-4">
		@{data.username}
	</h1>

	<img
		src={data.photoURL ?? '/user.png'}
		alt="photoURL"
		width="256"
		class="mx-auto"
	/>

	<p class="text-xl my-8">{data.bio ?? 'no bio yet...'}</p>
	<ul class="list-none flex flex-col gap-[8px]">
		{#each data.links as item}
			<li class="">
				<UserLink {...item} />
			</li>
		{/each}
	</ul>
</main>

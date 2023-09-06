<script lang="ts">
	import { PUBLIC_PAGE } from '$env/static/public';
	import { user, userData } from '$lib/firebase';
	import '../app.css';
	$user;
	$userData;
</script>

<div class="min-h-screen flex flex-col">
	<nav>
		<ul class="flex gap-8 justify-center py-2 bg-gray-950">
			<li>
				<a class="link link-hover text-lg" href={`${PUBLIC_PAGE}/login`}
					>LOGIN</a
				>
			</li>
			{#if $user}
				<li>
					<a
						class="link link-hover text-lg"
						href={`${PUBLIC_PAGE}/${$userData?.username}`}>PROFILE</a
					>
				</li>
			{/if}
		</ul>
	</nav>
	<slot />
</div>

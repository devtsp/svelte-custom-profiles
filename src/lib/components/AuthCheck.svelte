<script lang="ts">
	import { user } from '$lib/firebase';
</script>

{#if $user}
	<slot />
{:else}
	<p class="text-error my-10 text-center">
		You must be signed in to view this content. <a href="/login">Sign In</a>
	</p>
{/if}

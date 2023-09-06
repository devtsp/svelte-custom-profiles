<script lang="ts">
	import { user } from '$lib/firebase';
</script>

{#if $user}
	<slot />
{:else}
	<p class="text-error my-[10px] text-center">
		You must be signed in to view this content. <a
			href="/login"
			class="link text-accent opacity-70 text-xl hover:opacity-100">Sign In</a
		>
	</p>
{/if}

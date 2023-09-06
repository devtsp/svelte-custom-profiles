<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let data: PageData;
</script>

<main class="mx-auto my-4 w-[500px]">
	<p class="text-error">{$page.form?.problem ?? ''}</p>

	<form method="POST" use:enhance class="w-full">
		<div class="form-control">
			<label for="bio" class="label justify-center">
				<span class="label-text text-lg text-center">Your bio</span>
			</label>
			<textarea
				name="bio"
				class="textarea textarea-bordered textarea-neutral rounded"
				value={data.bio}
			/>
		</div>
		<button class="btn btn-sm btn-accent btn-outline mt-3 mx-auto block"
			>Update Bio</button
		>
	</form>
</main>

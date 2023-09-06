<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let data: PageData;
</script>

<main class="mx-auto my-4">
	<p class="text-error">{$page.form?.problem ?? ''}</p>

	<form method="POST" use:enhance class="w-[700px]">
		<div class="form-control">
			<label for="bio" class="label">
				<span class="label-text">Your bio</span>
			</label>
			<textarea
				name="bio"
				class="textarea textarea-bordered textarea-accent rounded"
				value={data.bio}
			/>
		</div>
		<button class="btn btn-sm btn-primary mt-3 ml-auto block">Update Bio</button
		>
	</form>
</main>

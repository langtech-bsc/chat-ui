<script lang="ts">
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { env as envPublic } from "$env/dynamic/public";
	import LogoHuggingFaceBorderless from "$lib/components/icons/LogoHuggingFaceBorderless.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { useSettingsStore } from "$lib/stores/settings";
	import { cookiesAreEnabled } from "$lib/utils/cookiesAreEnabled";
	import Logo from "./icons/Logo.svelte";

	const settings = useSettingsStore();
	let checkboxChecked = false;
	function handleSubmit(event: Event) {
        // Prevent form submission if checkbox is not checked
        if (!checkboxChecked && envPublic.PUBLIC_FORCE_ETHICS_MODAL_CHECKBOX === "1") {
            event.preventDefault();
            alert("You must accept the terms and conditions to proceed.");
        }
    }
</script>

<Modal on:close>
	<div
		class="from-primary-500/40 via-primary-500/10 to-primary-500/0 flex w-full flex-col items-center gap-6 bg-gradient-to-b px-5 pb-8 pt-9 text-center sm:px-6"
	>
		<h2 class="flex items-center text-2xl font-semibold text-gray-800">
			<Logo classNames="mr-1" />
			{envPublic.PUBLIC_APP_NAME}
		</h2>

		<p class="text-lg font-semibold leading-snug text-gray-800" style="text-wrap: balance;">
			{envPublic.PUBLIC_APP_DESCRIPTION}
		</p>

		<p class="text-sm text-gray-500">
			{envPublic.PUBLIC_APP_DISCLAIMER_MESSAGE}
		</p>
		<div class="flex w-full flex-col items-center gap-2">
			{#if envPublic.PUBLIC_FORCE_ETHICS_MODAL_CHECKBOX === "1"}
				<label>
					<input type="checkbox" bind:checked={checkboxChecked} />
					I have read and agree to the 
					<a href="/privacy" target="_blank" class="text-blue-500 hover:underline">
						Terms & Conditions and Privacy Policy
					</a>.
				</label>
			{/if}
			<button
				class="w-full justify-center rounded-full border-2 border-gray-300 bg-black px-5 py-2 text-lg font-semibold text-gray-100 transition-colors hover:bg-gray-900"
				class:bg-white={$page.data.loginEnabled}
				class:text-gray-800={$page.data.loginEnabled}
				class:hover:bg-slate-100={$page.data.loginEnabled}
				on:click|preventDefault|stopPropagation={() => {
					if (!cookiesAreEnabled()) {
						window.open(window.location.href, "_blank");
					}
					
					if (!checkboxChecked && envPublic.PUBLIC_FORCE_ETHICS_MODAL_CHECKBOX === "1") alert("You must accept the terms and conditions to proceed.");
					else $settings.ethicsModalAccepted  = true
				}}
			>
				{#if $page.data.loginEnabled}
					{#if $page.data.guestMode}
						Continue as guest
					{:else}
						Explore the app
					{/if}
				{:else}
					Start chatting
				{/if}
			</button>
			{#if $page.data.loginEnabled}
				<form action="{base}/login" target="_self" method="POST" class="w-full" on:submit={handleSubmit}>
					<button
						type="submit"
						class="flex w-full flex-wrap items-center justify-center whitespace-nowrap rounded-full border-2 border-black bg-black px-5 py-2 text-lg font-semibold text-gray-100 transition-colors hover:bg-gray-900"
					>
						Sign in
						{#if envPublic.PUBLIC_APP_NAME === "HuggingChat"}
							<span class="flex items-center">
								&nbsp;with <LogoHuggingFaceBorderless classNames="text-xl mr-1 ml-1.5 flex-none" /> Hugging
								Face
							</span>
						{/if}
					</button>
				</form>
			{/if}
			{#if envPublic.PUBLIC_ORIGIN}
			<p>
				<a href="{envPublic.PUBLIC_ORIGIN}{base}" target="_blank" class="text-neutral-500 hover:underline">
					If you're having trouble, click here.
				</a>
			</p>
			{/if}
		</div>
	</div>
</Modal>

<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { source } from 'sveltekit-sse';
	import EmergencyCallNotification from '$lib/components/emergencyCallNotification.svelte';
	import { page } from '$app/stores'; // Import the $page store
	import type { Unsubscriber } from 'svelte/store';

	let showNotification = false;
	let currentNotification = '';
	let currentPath: string = '';

	const connection = source('/api/notifications');
	const notificationValue = connection.select('notification');

	let unsubscribePage: Unsubscriber = page.subscribe(($page) => {
		currentPath = $page.url.pathname;
	});

	onMount(() => {
	
		notificationValue.subscribe((value) => {
			if (value && currentPath !== '/admin') {
					showNotification = true;
					const jsonValue = JSON.parse(value);
					currentNotification = jsonValue.message;
				}
			});

		return () => {
			connection.close();
		};
	});
	

	function closeNotification() {
		showNotification = false;
	}
</script>

<svelte:head>
	<title>FlameWatch</title>
</svelte:head>

{#if showNotification}
	<EmergencyCallNotification message={currentNotification} onClose={closeNotification} />
{/if}

<slot />
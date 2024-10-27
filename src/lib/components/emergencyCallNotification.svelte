<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Phone, X, AlarmSmoke, Flame } from 'lucide-svelte';

	export let message = '';
	export let onClose;

	let seconds = 0;
	let status = 'Connecting...';

	let timer: ReturnType<typeof setInterval>;
	let statusTimer: ReturnType<typeof setTimeout>;

	onMount(() => {
		timer = setInterval(() => {
			seconds += 1;
		}, 1000);

		statusTimer = setTimeout(() => {
			status = 'Connected to Emergency Services';
		}, 3000);
	});

	onDestroy(() => {
		clearInterval(timer);
		clearTimeout(statusTimer);
	});

	function formatTime(totalSeconds: number) {
		const minutes = Math.floor(totalSeconds / 60);
		const remainingSeconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<div
	class="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
>
	<div class="animate-slideIn w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
		<div class="mb-4 flex items-center justify-between">
			<AlarmSmoke class="h-5 w-5" />
			<h3 class="text-xl font-bold text-red-600">Flamewatch!</h3>
			<button on:click={onClose} class="text-gray-500 hover:text-gray-700 focus:outline-none">
				<X size={24} />
			</button>
		</div>
		<div class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<div class="flex">
				<Flame class="h-5 w-5" />
				<strong class="ml-2 font-bold">Fire Alarm!</strong>
			</div>
			<p>The fire alarm in the Kitchen has detected a fire!</p>
			<p>You need to take immediate action!</p>
		</div>
		<div class="flex justify-center">
			<div class="border border-black px-3 py-2 rounded-md bg-stone-400">
				<button on:click={onClose} class="text-black hover:text-gray-700 focus:outline-none">
					<p>Close</p>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out;
	}

	.animate-slideIn {
		animation: slideIn 0.3s ease-out;
	}

	.animate-ping {
		animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>

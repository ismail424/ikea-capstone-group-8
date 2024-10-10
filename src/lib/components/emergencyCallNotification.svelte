<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Phone, X } from 'lucide-svelte';
    
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

<style>
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
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
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
</style>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-slideIn">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-red-600">Emergency Call Active</h3>
      <button on:click={onClose} class="text-gray-500 hover:text-gray-700 focus:outline-none">
        <X size={24} />
      </button>
    </div>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <Phone class="h-4 w-4 animate-pulse" />
      <strong class="font-bold">Emergency Services</strong>
      <span class="block sm:inline">{status}</span>
    </div>
    <div class="flex justify-center items-center mb-4">
      <div class="relative w-24 h-24">
        <div class="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
        <div class="relative flex items-center justify-center w-full h-full bg-red-500 rounded-full animate-pulse">
          <Phone class="h-12 w-12 text-white" />
        </div>
      </div>
    </div>
    <p class="text-center text-2xl font-bold mb-4">{formatTime(seconds)}</p>
    <p class="text-center text-sm text-gray-600 mb-4">{message}</p>
    <div class="flex justify-center">
      <button 
        on:click={onClose}
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors animate-pulse"
      >
        End Call
      </button>
    </div>
  </div>
</div>
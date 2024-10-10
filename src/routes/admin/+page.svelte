<script lang="ts">
    import type { PageData } from './$types';
    import { notifications } from '$lib/notificationStore';
    
    function triggerNotification() {
        notifications.add('There is a fire in the house, Calling Emergency Services');
    }
    export let data: PageData;

</script>

<div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Admin Control Panel</h2>

    <button 
        on:click={triggerNotification} 
        class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:bg-blue-800 transition transform hover:scale-105 active:scale-95">
        Trigger Notification
    </button>
</div>

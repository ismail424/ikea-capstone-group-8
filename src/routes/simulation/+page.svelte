<script>
    import { onMount } from 'svelte';
    import { Card } from 'flowbite-svelte';
    import { FireOutline, BellActiveAltOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';
  
    let isFire = false;
    let isStoveOn = false;
    let isCooking = false;
    /**
	 * @type {string | null}
	 */
    let notification = null;

  function simulateFireDetection() {
    isFire = true;
    notification = "Fire detected in Kök 1! Please take immediate action!";
  }

  function simulateStoveStatus() {
    isStoveOn = true;
    isCooking = true;
  }

  function resetSimulation() {
    isFire = false;
    isStoveOn = false;
    isCooking = false;
    notification = null;
  }

  onMount(() => {
    setTimeout(simulateStoveStatus, 3000); // Simulate stove on after 3 seconds
    setTimeout(simulateFireDetection, 7000); // Simulate fire detection after 7 seconds
  });
</script>
  
<div class="container mx-auto px-4">
    <header class="text-center my-12">
      <h1 class="text-4xl font-bold">Smart Brandvarnare Simulation</h1>
      <p class="text-lg mt-2">Experience how our smart smoke detector works in real-time.</p>
    </header>
  
    <section class="my-12 flex justify-center">
      <Card href="#" class="p-6 bg-white shadow-lg rounded-lg w-96 text-center">
        <div class="flex flex-col items-center justify-center">
          <FireOutline class="w-16 h-16 text-red-500 mb-4" />
          <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Brandvarnare</h5>
          <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">Kök 1</p>
          <div class="flex items-center mt-4">
            <span>Status: <span class={isFire ? 'text-red-500' : 'text-green-500'}>{isFire ? 'Fire Detected' : 'Active'}</span></span>
          </div>
        </div>
      </Card>
    </section>
  
    <section class="my-12 flex justify-center">
      <Card href="#" class="p-6 bg-white shadow-lg rounded-lg w-96 text-center">
        <div class="flex flex-col items-center justify-center">
          <ExclamationCircleOutline class="w-16 h-16 text-yellow-500 mb-4" />
          <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Spis Sensor</h5>
          <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">Kök</p>
          <div class="flex items-center mt-4">
            <span>Status: <span class={isStoveOn ? 'text-yellow-500' : 'text-green-500'}>{isStoveOn ? 'Stove On' : 'Off'}</span></span>
          </div>
        </div>
      </Card>
    </section>
  
    {#if notification}
      <section class="my-12 flex justify-center">
        <div class="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 w-96" role="alert">
          <p class="font-bold">Notification</p>
          <p>{notification}</p>
          <button on:click={resetSimulation} class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Reset Simulation</button>
        </div>
      </section>
    {/if}
  
    {#if isCooking}
      <section class="my-12 flex justify-center">
        <div class="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 w-96" role="alert">
          <p class="font-bold">Notification</p>
          <p>Stove is on. Cooking detected. Fire alarms might trigger false alarms.</p>
        </div>
      </section>
    {/if}
  
    <section class="my-12 flex justify-center">
      <button class="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded" on:click={() => window.location.href='/'}>
        Back to Overview
      </button>
    </section>
  </div>
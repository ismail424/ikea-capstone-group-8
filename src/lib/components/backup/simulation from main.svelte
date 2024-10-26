<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    import { Flame, Home, Thermometer, Wind, AlertCircle, Phone, Battery, Clock } from 'lucide-svelte';
    import { get } from 'svelte/store';
    import { fade } from 'svelte/transition';
    import { notifications } from '$lib/notificationStore';
      
    function triggerNotification() {
        notifications.add('There is a fire in the house, Calling Emergency Services');
    }
    interface Sensor {
      id: string;
      type: 'brandvarnare' | 'spis';
      location: string;
      status: string;
      batteryLevel?: number;
      temperature?: number;
      smoke?: number;
    }
    
    let sensors: Writable<Sensor[]> = writable([
      { id: '1', type: 'brandvarnare', location: 'Kök', status: 'active', batteryLevel: 85, temperature: 22, smoke: 0 },
      { id: '2', type: 'spis', location: 'Kök', status: 'stove-off', },
      { id: '3', type: 'brandvarnare', location: 'Sovrum', status: 'active',  batteryLevel: 92, temperature: 21, smoke: 0 },
      { id: '4', type: 'brandvarnare', location: 'Vardagsrum', status: 'active',  batteryLevel: 78, temperature: 22, smoke: 0 },
    ]);
    
    let notification: Writable<string | null> = writable(null);
    let isFireSimulation: Writable<boolean> = writable(false);
    let isFalseAlarm: Writable<boolean> = writable(false);
    let isEmergencyCallActive: Writable<boolean> = writable(false);
    
    function updateSensor(id: string, updates: Partial<Sensor>): void {
      sensors.update(sensorList => 
        sensorList.map(sensor => 
          sensor.id === id ? { ...sensor, ...updates } : sensor
        )
      );
    }
    
    function determineStatus(temperature: number, smoke: number): string {
      if (temperature > 50 || smoke > 50) return 'alarm';
      if (temperature > 30 || smoke > 30) return 'danger';
      if (temperature > 25 || smoke > 10) return 'warning';
      return 'normal';
    }
    
    function idleVariations(): void {
      sensors.update(sensorList => 
        sensorList.map(sensor => {
          if (sensor.type === 'brandvarnare' && sensor.temperature !== undefined && sensor.smoke !== undefined && sensor.batteryLevel !== undefined) {
            const tempVariation = (Math.random() - 0.5) * 3;
            const smokeVariation = Math.random() * 1;
            const batteryDrain = Math.random() * 0.2;
            const newTemp = Math.round((sensor.temperature + tempVariation) * 10) / 10;
            const newSmoke = Math.max(0, Math.round((sensor.smoke + smokeVariation) * 10) / 10);
            const newBattery = Math.max(0, Math.round(sensor.batteryLevel - batteryDrain));
            const newStatus = determineStatus(newTemp, newSmoke);
            return { ...sensor, temperature: newTemp, smoke: newSmoke, batteryLevel: newBattery, status: newStatus };
          }
          return sensor;
        })
      );
    
      if (Math.random() < 0.1) {
        toggleStove();
      }
    }
    
    function toggleStove(): void {
      updateSensor('2', { status: get(sensors).find(sensor => sensor.id === '2')?.status === 'stove-on' ? 'stove-off' : 'stove-on' });
    }
    
    function smoothTransition(targetState: 'false-alarm' | 'fire', duration: number): void {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
    
        sensors.update(sensorList =>
          sensorList.map(sensor => {
            if (sensor.location === 'Kök' && sensor.type === 'brandvarnare' && sensor.temperature !== undefined && sensor.smoke !== undefined) {
              const targetTemp = targetState === 'false-alarm' ? 45 : 80;
              const targetSmoke = targetState === 'false-alarm' ? 40 : 90;
              const newTemp = Math.round((sensor.temperature + (targetTemp - sensor.temperature) * progress) * 10) / 10;
              const newSmoke = Math.round((sensor.smoke + (targetSmoke - sensor.smoke) * progress) * 10) / 10;
              const newStatus = determineStatus(newTemp, newSmoke);
              return { ...sensor, temperature: newTemp, smoke: newSmoke, status: newStatus };
            }
            return sensor;
          })
        );
    
        if (progress >= 1) {
          clearInterval(interval);
          if (targetState === 'fire') {
            isFireSimulation.set(true);
          }
        }
      }, 100);
    }
    
    function startFalseAlarm(): void {
      isFalseAlarm.set(true);
      isFireSimulation.set(false);
      toggleStove();
      smoothTransition('false-alarm', 5000);
      notification.set('Simulering av falskt larm startat. Spisen är på och orsakar rök.');
    }
    
    function startFireSimulation(): void {
      isFireSimulation.set(true);
      isFalseAlarm.set(false);
      smoothTransition('fire', 10000);
      notification.set('Brandsimulering startad. Observera sensorernas beteende.');
      triggerNotification();
    }
    
    function spreadFire(): void {
      sensors.update(sensorList => {
        const sourceRoom = sensorList.find(sensor => sensor.status === 'alarm' || sensor.status === 'danger');
        
        if (sourceRoom) {
          const adjacentRooms = sensorList.filter(sensor => sensor.id !== sourceRoom.id && sensor.type === 'brandvarnare');
          const targetRoom = adjacentRooms[Math.floor(Math.random() * adjacentRooms.length)];
          
          if (targetRoom && targetRoom.temperature !== undefined && targetRoom.smoke !== undefined) {
            const tempIncrease = Math.random() * 5 + 5;
            const smokeIncrease = Math.random() * 10 + 10;
            
            targetRoom.temperature = Math.min(100, targetRoom.temperature + tempIncrease);
            targetRoom.smoke = Math.min(100, targetRoom.smoke + smokeIncrease);
            targetRoom.status = determineStatus(targetRoom.temperature, targetRoom.smoke);
          }
        }
        
        return sensorList;
      });
    }
    
    function makeEmergencyCall(): void {
      isEmergencyCallActive.set(true);
    }
    
    let idleInterval: ReturnType<typeof setInterval> | undefined;
    let fireSpreadInterval: ReturnType<typeof setInterval> | undefined;
    
    onMount(() => {
      idleInterval = setInterval(idleVariations, 2000);
    });
    
    $: if ($isFireSimulation) {
      fireSpreadInterval = setInterval(spreadFire, 5000);
    } else {
      clearInterval(fireSpreadInterval);
    }
    
    onDestroy(() => {
      clearInterval(idleInterval);
      clearInterval(fireSpreadInterval);
    });
    </script>
    
      <div class="min-h-screen bg-gray-100 p-8">
        <div class="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <h2 class="text-3xl font-bold text-center mb-6">Smart Brandvarnare Simulation</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each $sensors as sensor (sensor.id)}
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                  <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        {#if sensor.type === 'brandvarnare'}
                          <Flame class="h-8 w-8" color={
                            sensor.status === 'alarm' ? 'red' :
                            sensor.status === 'danger' ? 'orange' :
                            sensor.status === 'warning' ? 'yellow' :
                            'gray'
                          }/>
                        {:else if sensor.type === 'spis'}
                          <Home class="h-8 w-8" color={sensor.status === 'stove-on' ? 'orange' : 'gray'}/>
                        {/if}
                        <div>
                          <h3 class="font-semibold text-lg">{sensor.location}</h3>
                          <p class="text-sm text-gray-500">{sensor.type === 'brandvarnare' ? 'Brandvarnare' : 'Spis'}</p>
                        </div>
                      </div>
                      {#if sensor.type === 'brandvarnare'}
                        <span class="px-2 py-1 rounded-full text-xs font-semibold" class:bg-green-100={sensor.status === 'normal'} class:text-green-800={sensor.status === 'normal'} class:bg-yellow-100={sensor.status === 'warning'} class:text-yellow-800={sensor.status === 'warning'} class:bg-orange-100={sensor.status === 'danger'} class:text-orange-800={sensor.status === 'danger'} class:bg-red-100={sensor.status === 'alarm'} class:text-red-800={sensor.status === 'alarm'}>
                          {sensor.status === 'normal' ? 'Normal' :
                           sensor.status === 'warning' ? 'Varning' :
                           sensor.status === 'danger' ? 'Fara' : 'ALARM'}
                        </span>
                      {:else if sensor.type === 'spis'}
                        <span class="px-2 py-1 rounded-full text-xs font-semibold" class:bg-gray-100={sensor.status === 'stove-off'} class:text-gray-800={sensor.status === 'stove-off'} class:bg-orange-100={sensor.status === 'stove-on'} class:text-orange-800={sensor.status === 'stove-on'}>
                          {sensor.status === 'stove-on' ? 'På' : 'Av'}
                        </span>
                      {/if}
                    </div>
                    {#if sensor.type === 'brandvarnare'}
                      <div class="space-y-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <Thermometer class="h-4 w-4 text-blue-500" />
                            <span class="text-sm font-medium">{sensor.temperature?.toFixed(1) ?? 'N/A'}°C</span>
                          </div>
                          <div class="w-1/2 bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: {sensor.temperature}%"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <Wind class="h-4 w-4 text-gray-500" />
                            <span class="text-sm font-medium">{sensor.smoke?.toFixed(1) ?? 'N/A'}%</span>
                          </div>
                          <div class="w-1/2 bg-gray-200 rounded-full h-2.5">
                            <div class="bg-gray-600 h-2.5 rounded-full" style="width: {sensor.smoke}%"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <Battery class="h-4 w-4 text-green-500" />
                            <span class="text-sm font-medium">{sensor.batteryLevel}%</span>
                          </div>
                          <div class="w-1/2 bg-gray-200 rounded-full h-2.5">
                            <div class="bg-green-600 h-2.5 rounded-full" style="width: {sensor.batteryLevel}%"></div>
                          </div>
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
            {#if $notification}
              <div class="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                <div class="flex items-start">
                  <AlertCircle class="h-6 w-6 mr-2 flex-shrink-0" />
                  <p>{$notification}</p>
                </div>
              </div>
            {/if}
            <div class="mt-6 flex flex-wrap justify-center gap-4">
              <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors" on:click={() => window.location.reload()}>
                Återställ Simulation
              </button>
              <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors" on:click={startFireSimulation} disabled={$isFireSimulation || $isFalseAlarm}>
                Starta Brandsimulering
              </button>
              <button class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors" on:click={startFalseAlarm} disabled={$isFireSimulation || $isFalseAlarm}>
                Simulera Falskt Larm
              </button>
              {#if $isFireSimulation}
                <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors" on:click={makeEmergencyCall} disabled={$isEmergencyCallActive}>
                  Ring SOS Alarm
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>
      
      {#if $isEmergencyCallActive}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade={{ delay: 250, duration: 300 }}>
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h3 class="text-xl font-bold mb-4">Nödsamtal aktivt</h3>
        <p class="mb-4">Simulerat nödsamtal till räddningstjänsten pågår...</p>
        <div class="flex justify-center">
          <Phone class="h-12 w-12 text-green-500 animate-pulse" />
        </div>
        <button class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors" on:click={() => isEmergencyCallActive.set(false)}>
          Avsluta samtal
        </button>
      </div>
      </div>
      {/if}  
  
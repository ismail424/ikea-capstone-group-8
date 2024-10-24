<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCouch, faUtensils, faBed, faGamepad, faTshirt } from '@fortawesome/free-solid-svg-icons';
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
    type: 'brandvarnare' | 'uttag' | 'temp';
    location: string;
    status: string;
    batteryLevel?: number;
    temperature?: number;
    smoke?: number;
  }

  // Sensor data from your simulation
  let sensors: Writable<Sensor[]> = writable([
    { id: '1', type: 'brandvarnare', location: 'Kök', status: 'active', batteryLevel: 85, temperature: 22, smoke: 0 },
    { id: '2', type: 'uttag', location: 'Kök', status: 'stove-off', },
    { id: '3', type: 'brandvarnare', location: 'Sovrum', status: 'active',  batteryLevel: 92, temperature: 21, smoke: 0 },
  ]);

  let rooms: Writable<String[]> = writable([
    "kök", "sovrum", "vardagsrum", "barnensrum"
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

<!-- Layout: FlameWatch Room Cards with Sensor Integration -->
<div class="app-container">
  <div class="home-header">
    <h1>FlameWatch</h1>
  </div>

  <div class="room-header"><h3>Rooms</h3></div>

  <!-- Room Cards -->
   {#each $rooms as room}

    <div class="rooms">
      <p> Hej</p>
    {#each $sensors as sensor (sensor.id)}
      <div class="room-card {sensor.location === 'Vardagsrum' ? 'living-room' : 
                              sensor.location === 'Kök' ? 'kitchen' : 
                              sensor.location === 'Sovrum' ? 'bedroom' : ''}">
        <div class="card-header">
          {#if sensor.location === 'Vardagsrum'}
            <FontAwesomeIcon icon={faCouch} class="icon" />
          {:else if sensor.location === 'Kök'}
            <FontAwesomeIcon icon={faUtensils} class="icon" />
          {:else if sensor.location === 'Sovrum'}
            <FontAwesomeIcon icon={faBed} class="icon" />
          {/if}

          <h3>{sensor.location}</h3>

          <!-- Status Indicator (e.g., Alarm, Normal) -->
          <div class="alarm-oval">{sensor.status === 'alarm' ? 'Alarm' : sensor.status === 'active' ? 'Normal' : 'Off'}</div>
        </div>

        <!-- Sensor Data (Temperature, Smoke, Battery) -->
        {#if sensor.type === 'brandvarnare'}
          <div class="room-product-icons">
            <div class="room-icon-circle">
              <Thermometer class="h-4 w-4 text-blue-500" />
              <span>{sensor.temperature?.toFixed(1) ?? 'N/A'} °C HEJ</span>
            </div>
            <div class="room-icon-circle">
              <Wind class="h-4 w-4 text-gray-500" />
              <span>{sensor.smoke?.toFixed(1) ?? 'N/A'}%</span>
            </div>
            <div class="room-icon-circle">
              <Battery class="h-4 w-4 text-green-500" />
              <span>{sensor.batteryLevel}%</span>
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {/each}
</div>

<!-- CSS -->
<style>
  .app-container {
    max-width: 375px;
    margin: 0 auto;
    padding: 10px;
    background-color: #f8f8f8;
    font-family: 'Arial', sans-serif;
  }
  .home-header, .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  .rooms {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
  }
  .room-card {
    padding: 15px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
  .room-product-icons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .room-icon-circle {
    background-color: white;
    border-radius: 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    font-size: 1.5rem;
    color: black;
  }
  .living-room { background-color: #99bbcf; }
  .kitchen { background-color: #a5ba5c; }
  .bedroom { background-color: #c15564; }
  
</style>

<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faCouch,
		faUtensils,
		faBed,
		faGamepad,
		faTshirt
	} from '@fortawesome/free-solid-svg-icons';
	import { writable, type Writable } from 'svelte/store';
	import { Thermometer, Wind, Battery, AlarmSmoke, Pencil, Plug, X, Phone } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { notifications } from '$lib/notificationStore';

  function triggerNotification() {
        notifications.add('There is a fire in the house, Calling Emergency Services');
    }

	interface Sensor {
		id: string;
		name?: string | null;
		type: 'Brandvarnare' | 'Uttag' | 'Temperatur';
		status?: string;
		batteryLevel?: number | null;
		temperature?: number | null;
		smoke?: number | null;
		CO2?: number | null;
	}

	interface Room {
		id: string;
		name: string;
		sensors: Sensor[];
	}

	let rooms: Writable<Room[]> = writable([
		{
			id: '1',
			name: 'Kök',
			sensors: [
				{ id: '1', type: 'Brandvarnare', status: 'active', batteryLevel: 85, smoke: 0, CO2: 0 },
				{ id: '2', name: 'Ugn', type: 'Uttag', status: 'off' }
			]
		},
		{
			id: '2',
			name: 'Sovrum',
			sensors: [
				{ id: '3', type: 'Brandvarnare', status: 'active', batteryLevel: 92, smoke: 0, CO2: 0 }
			]
		}
	]);

	let newRoomName = '';
	let showAddRoomModal = writable(false);
	let newSensorName = '';
	let showAddSensorModal = writable(false);
	let selectedRoomId: string | '';

  let notification: Writable<string | null> = writable(null);
  let isFireSimulation: Writable<boolean> = writable(false);
  let isFalseAlarm: Writable<boolean> = writable(false);
  let isEmergencyCallActive: Writable<boolean> = writable(false);

	let firstSmokeLimit = 20; // Low limit for particles in the air
	let secondSmokeLimit = 40; // High limit for particles in the air
	let firstCO2Limit = 20; // Low limit for CO2 in the air
	let secondCO2Limit = 40; // High limit for CO2 in the air

	let selectedSensorType: Sensor['type'] = 'Brandvarnare';
	let newSensorProperties: Partial<Sensor> = {};

	function addRoom() {
		rooms.update((r) => [...r, { id: Date.now().toString(), name: newRoomName, sensors: [] }]);
		newRoomName = '';
	}

	function smokeToString(value: number | undefined | null) {
		let newValue = value?.toFixed(1);
		if (value?.toFixed(1) != null) {
			if (value < firstSmokeLimit) {
				return 'Low';
			} else if (value >= firstSmokeLimit && value < secondSmokeLimit) {
				return 'Medium';
			} else {
				return 'High!';
			}
		}
		return 'Unknown';
	}

	function CO2ToString(value: number | undefined | null) {
		let newValue = value?.toFixed(1);
		if (value?.toFixed(1) != null) {
			if (value < firstCO2Limit) {
				return 'Low';
			} else if (value >= firstCO2Limit && value < secondCO2Limit) {
				return 'Medium';
			} else {
				return 'High!';
			}
		}
		return 'unknown';
	}

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

	function deleteRoom(roomId: string) {
		rooms.update((r) => r.filter((room) => room.id !== roomId));
	}

	function closeModal() {
		showAddRoomModal.set(false);
		showAddSensorModal.set(false);
	}

	function addSensorToRoom(roomId: string | null) {
		rooms.update((r) =>
			r.map((room) =>
				room.id === roomId
					? {
							...room,
							sensors: [
								...room.sensors,
								{
									id: Date.now().toString(),
									name: newSensorName || '',
									type: selectedSensorType,
									...newSensorProperties
								}
							]
						}
					: room
			)
		);
		resetSensorForm();
	}

	// Reset form after sensor is added
	function resetSensorForm() {
		newSensorName = '';
		selectedSensorType = 'Brandvarnare';
		newSensorProperties = {};
	}

	// Delete sensor
	function deleteSensor(roomId: string, sensorId: string) {
		rooms.update((r) =>
			r.map((room) =>
				room.id === roomId
					? { ...room, sensors: room.sensors.filter((sensor) => sensor.id !== sensorId) }
					: room
			)
		);
	}

	// Update properties dynamically based on selected type
	$: newSensorProperties =
		selectedSensorType === 'Brandvarnare'
			? { batteryLevel: 100, smoke: 0, CO2: 0 }
			: selectedSensorType === 'Uttag'
				? { status: 'off' }
				: { temperature: 0 };
</script>

TODO::: > Se till att app-Home och Flamewatch har liknande design > Ändra så
länken till Flamewatch är Flamewatch och inte Simulation > Kolla buggen med att lägga till flera brandvarnare, är det samma för uttag? 
Är det något i backend så man bara kan lägga till ett visst antal. Den behöver initsiera ny simulation för alla nya sensorer.


<!-- Layout: FlameWatch Room Cards with Sensor Integration -->
<div class="app-container">
	<div class="home-header">
		<h1>FlameWatch</h1>
	</div>

	<div class="room-header">
		<h3>Rum</h3>
		<button on:click={() => showAddRoomModal.set(true)} class="plus-button">
			<Pencil size="19" />
		</button>
	</div>

	<!-- Room Cards -->
	{#each $rooms as room (room.id)}
		<div
			class="room-card {room.name === 'Kök'
				? 'kitchen'
				: room.name === 'Vardagsrum'
					? 'living-room'
					: room.name === 'Sovrum'
						? 'bedroom'
						: ''}"
		>
			<div class="card-header">
				<div class="card-name-icon">
					<span>
						<FontAwesomeIcon
							icon={room.name === 'Kök'
								? faUtensils
								: room.name === 'Vardagsrum'
									? faCouch
									: room.name === 'Sovrum'
										? faBed
										: faTshirt}
							class="icon"
						/>
					</span>
					<h3>{room.name}</h3>
				</div>
				<button
					on:click={() => {
						selectedRoomId = room.id;
						showAddSensorModal.set(true);
					}}
					class="plus-button"
				>
					<Pencil size="19" />
				</button>
			</div>

			<!-- List Sensors -->
			{#each room.sensors as sensor (sensor.id)}
				{#if sensor.type === 'Brandvarnare'}
					<div class="sensor-row">
						<div class="sensor-header">
							<div class="card-name-icon">
								<div class="room-icon-circle">
									<AlarmSmoke class="text-black-500 h-4 w-4" />
								</div>
								<h4>{sensor.type}</h4>
							</div>
							<div class="flex space-x-1">
								<span class="text-[12px]">{sensor.batteryLevel}%</span>
								<Battery class="h-4 w-4 text-green-500" />
							</div>
						</div>
						<div class="sensor-data">
							<div>
								<span>Partiklar:</span>
								<span>{smokeToString(sensor.smoke)} </span>
							</div>
						</div>
						<div class="sensor-data">
							<div>
								<span>CO2:</span>
								<span>{CO2ToString(sensor.CO2)}</span>
							</div>
						</div>
					</div>
				{:else if sensor.type === 'Uttag'}
					<div class="sensor-row">
						<div class="sensor-header">
							<div class="card-name-icon">
								<div class="room-icon-circle">
									<Plug class="text-black-500 h-4 w-4" />
								</div>
								<h4>{sensor.type}</h4>
							</div>
						</div>
						<div class="sensor-data"></div>
						<div>{sensor.name} Status: {sensor.status}</div>
					</div>
				{:else if sensor.type === 'Temperatur'}
					<div>
						<span>{sensor.temperature?.toFixed(1)} °C</span>
					</div>
				{/if}
			{/each}
		</div>
	{/each}

	<!-- Add Room Modal -->
	{#if $showAddRoomModal}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal" on:click={closeModal}>
			<div class="modal-content" on:click|stopPropagation>
				<div class="modal-header">
					<h3 class="font-bold">Lägg till/ta bort rum</h3>
					<button on:click={closeModal}><X /></button>
				</div>

				<!-- Text box for adding a new room -->
				<div class="modal-room-row mb-5">
					<input type="text" bind:value={newRoomName} placeholder="Rumsnamn" />
					<button class="button" on:click={addRoom}>Lägg till</button>
				</div>
				<!-- List of existing rooms with delete option -->
				<ul class="modal-room-ul">
					{#each $rooms as room (room.id)}
						<li class="modal-room-li">
							<div class="modal-room-row">
								{room.name}
								<button class="button" on:click={() => deleteRoom(room.id)}>Ta bort</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	<!-- Sensor Modal -->
	{#if $showAddSensorModal && selectedRoomId}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal" on:click={closeModal}>
			<div class="modal-content" on:click|stopPropagation>
				<div class="modal-header">
					<h3 class="font-bold">Lägg till / Ta bort sensor</h3>
					<button on:click={closeModal}><X /></button>
				</div>
				<!-- Dropdown for Sensor Type -->
				<div class="modal-room-row mb-5">
					<label for="sensor-type">Sensortyp:</label>
					<select class="ml-2" id="sensor-type" bind:value={selectedSensorType}>
						<option value="Brandvarnare">Brandvarnare</option>
						<option value="Uttag">Uttag</option>
						<option value="Temperatur">Temperatur</option>
					</select>
				</div>
				<div class="modal-room-row mb-3">
					<!-- {#if selectedSensorType != "Brandvarnare"} -->
					<label for="sensor-name">Sensornamn:</label>
					<input class="ml-2" id="sensor-name" type="text" placeholder="Sensornamn" bind:value={newSensorName} />
					<!-- {/if} -->
				</div>
				<div class="flex justify-end">
					<button class="button" on:click={() => addSensorToRoom(selectedRoomId)}>Lägg till</button>
				</div>

				<!-- Existing Sensors -->
				<h3>Tillagda</h3>
        <ul class="modal-room-ul">
				{#each $rooms.find((room) => room.id === selectedRoomId)?.sensors ?? [] as sensor}
        <li class="modal-room-li">
          <div class="modal-room-row">
						<h4>{sensor.name || ""} ({sensor.type})</h4>
						<button class="button" on:click={() => deleteSensor(selectedRoomId, sensor.id)}>Ta bort</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
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
<style>
	.app-container {
		max-width: 375px;
		margin: 0 auto;
		padding: 10px;
		background-color: #f8f8f8;
		font-family: 'Arial', sans-serif;
	}
	.home-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 3px;
		padding-bottom: 15px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 3px;
		padding-bottom: 5px;
	}

	.card-name-icon {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-name-icon h3 {
		padding-left: 10px;
	}

	.home-header h1 {
		font-weight: bold;
	}
	.room-card {
		padding: 10px;
		border-radius: 10px;
		background-color: #ffda23;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
		margin-bottom: 5px;
	}
	.sensor-row {
		margin-top: 10px;
		background-color: rgba(255, 255, 255, 0.3);
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		padding: 4px;
	}
	.sensor-header {
		margin-top: 1px;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
	}
	.sensor-data {
		display: flex;
		justify-content: space-between;
	}
	.plus-button {
		background-color: none;
		border: none;
		cursor: pointer;
	}
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 150px;
	}
	.modal-content {
		background: #f8f8f8ff;
		padding: 20px;
		border-radius: 10px;
		text-align: center;
	}

	.modal-header {
		margin-top: 1px;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
	}

	.modal-room-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-room-ul {
		padding: 0px;
		list-style-type: none;
		border-radius: 5px;
		overflow: hidden;
	}
	.modal-room-li {
		background-color: rgb(227, 227, 227);
		padding: 2px;
		padding-left: 10px;
	}

	.modal-room-ul li:nth-child(even) {
		background: #b5b5b5;
	}

	.button {
		margin-left: 5px;
		padding: 4px 10px;
		border: 0px;
		font-size: 12px;
		transition: all 150ms ease-in-out;

		border-radius: 7px;
		font-weight: 400;

		color: #000;
		background: #d2d0d0;
		box-shadow:
			rgba(50, 50, 93, 0.25) 0 50px 100px -20px,
			rgba(0, 0, 0, 0.3) 0 30px 60px -30px,
			rgba(10, 37, 64, 0.05) 0 -2px 6px 0 inset,
			rgba(0, 0, 0, 0.02) 0 1px 3px 0,
			rgba(27, 31, 35, 0) 0 0 0 1px;
	}

	input[type='text'] {
		font-size: 16px;
		max-height: 28px;
	}
	.button:hover {
		background: #f9f9f9;
	}

	.button:active {
		transform: scale(0.95);
	}

	.room-header {
		color: black;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 7px;
		padding-top: 3px;
	}

	.room-icon-circle {
		background-color: #fffffff0;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 5px;
	}

	.living-room {
		background-color: #99bbcf;
	}
	.kitchen {
		background-color: #a5ba5c;
	}
	.bedroom {
		background-color: #c15564;
	}
</style>

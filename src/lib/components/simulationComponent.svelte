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
	import {
		Thermometer,
		Wind,
		Battery,
		AlarmSmoke,
		Pencil,
		Plug,
		X,
		Phone,
		AlertCircle
	} from 'lucide-svelte';
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
		CO?: number | null;
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
				{ id: '1', type: 'Brandvarnare', status: 'active', batteryLevel: 85, smoke: 0, CO: 0, temperature: 24 },
				{ id: '2', name: 'Spis', type: 'Uttag', status: 'off' },  // Changed initial status to 'off'
			]
		},
		{
			id: '2',
			name: 'Sovrum',
			sensors: [
				{ id: '3', type: 'Brandvarnare', status: 'active', batteryLevel: 92, smoke: 0, CO: 0, temperature: 24 }
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
	let firstCOLimit = 20; // Low limit for CO in the air
	let secondCOLimit = 40; // High limit for CO in the air

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
				return 'Låg';
			} else if (value >= firstSmokeLimit && value < secondSmokeLimit) {
				return 'Mellan';
			} else {
				return 'Hög';
			}
		}
		return 'Unknown';
	}

	function COToString(value: number | undefined | null) {
		let newValue = value?.toFixed(1);
		if (value?.toFixed(1) != null) {
			if (value < firstCOLimit) {
				return 'Låg';
			} else if (value >= firstCOLimit && value < secondCOLimit) {
				return 'Mellan';
			} else {
				return 'Hög';
			}
		}
		return 'unknown';
	}

	function updateSensor(roomId: string, sensorId: string, updates: Partial<Sensor>): void {
		rooms.update((roomList) =>
			roomList.map((room) =>
				room.id === roomId
					? {
							...room,
							sensors: room.sensors.map((sensor) =>
								sensor.id === sensorId ? { ...sensor, ...updates } : sensor
							)
						}
					: room
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
    rooms.update((roomList) =>
        roomList.map((room) => ({
            ...room,
            sensors: room.sensors.map((sensor) => {
                if (
                    sensor.CO !== undefined &&
                    sensor.smoke !== undefined &&
                    sensor.batteryLevel !== undefined &&
                    sensor.CO !== null &&
                    sensor.smoke !== null &&
                    sensor.batteryLevel !== null &&
                    sensor.temperature !== undefined &&
                    sensor.temperature !== null

                ) {
                    const isKitchen = room.name === 'Kök';
                    // Smaller variations for bedroom sensors
                    const variationMultiplier = isKitchen ? 1 : 0.7;
                    
                    const tempVariation = (Math.random() - 0.5) * 1 * variationMultiplier;
                    const smokeVariation = Math.random() * 1 * variationMultiplier;
                    const coVariation = (Math.random() - 0.5) * 2 * variationMultiplier;
                    const batteryDrain = Math.random() * 0.2;

                    const newTemp = Math.round((sensor.temperature + tempVariation) * 10) / 10;
                    const newCO = Math.max(0, Math.round((sensor.CO + coVariation) * 10) / 10);
                    const newSmoke = Math.max(0, Math.round((sensor.smoke + smokeVariation) * 10) / 10);
                    const newBattery = Math.max(0, Math.round(sensor.batteryLevel - batteryDrain));
                    const newStatus = determineStatus(newCO, newSmoke);

                    return {
                        ...sensor,
                        temperature: newTemp,
                        smoke: newSmoke,
                        CO: newCO,
                        batteryLevel: newBattery,
                        status: newStatus
                    };
                }
                return sensor;
            })
        }))
    );

    if (Math.random() < 0.1) {
        toggleStove();
    }
}

	function toggleStove(): void {
		rooms.update((roomList) =>
			roomList.map((room) => ({
				...room,
				sensors: room.sensors.map((sensor) => {
					if (sensor.id === '2' && sensor.type === 'Uttag') {
						return { ...sensor, status: sensor.status === 'on' ? 'off' : 'on' };
					}
					return sensor;
				})
			}))
		);
	}


	function smoothTransition(targetState: 'false-alarm' | 'fire', duration: number): void {
    const startTime = Date.now();
    const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        rooms.update((roomList) =>
            roomList.map((room) => ({
                ...room,
                sensors: room.sensors.map((sensor) => {
                    // Check if sensor is a smoke detector in either Kitchen or Bedroom
                    if (
                        (room.name === 'Kök' || room.name === 'Sovrum') &&
                        (sensor.type === 'Brandvarnare' || sensor.type === "Temperatur") &&
                        sensor.temperature !== undefined &&
                        sensor.smoke !== undefined && 
                        sensor.temperature != null
                    ) {
                        // Adjust targets based on room (bedroom gets lower values due to distance)
                        const isKitchen = room.name === 'Kök';
                        const targetTemp = targetState === 'false-alarm' 
                            ? (isKitchen ? 45 : 35)  // Lower temp in bedroom
                            : (isKitchen ? 80 : 60); // Lower temp in bedroom during fire
                        
                        const targetSmoke = targetState === 'false-alarm'
                            ? (isKitchen ? 40 : 30)  // Lower smoke in bedroom
                            : (isKitchen ? 90 : 70); // Lower smoke in bedroom during fire
                        
                        const targetCO = targetState === 'false-alarm'
                            ? (isKitchen ? 35 : 25)  // Lower CO in bedroom
                            : (isKitchen ? 75 : 55); // Lower CO in bedroom during fire
                          
                        const targetTemperature = targetState === 'false-alarm'
                            ? (isKitchen ? 30 : 26)  // Lower temperature in bedroom
                            : (isKitchen ? 55 : 40); // Lower temperature in bedroom during fire
                        
                        // Apply delayed effect to bedroom (simulate smoke spreading)
                        const roomDelay = isKitchen ? 0 : 0.3; // 30% delay for bedroom
                        const adjustedProgress = Math.max(0, Math.min(1, (progress - roomDelay) * 1.5));
                        
                        if (
                            sensor.CO != undefined &&
                            sensor.CO != null &&
                            sensor.smoke != undefined &&
                            sensor.smoke != null
                        ) {
                            const newCO =
                                Math.round((sensor.CO + (targetCO - sensor.CO) * adjustedProgress) * 10) / 10;
                            const newSmoke =
                                Math.round((sensor.smoke + (targetSmoke - sensor.smoke) * adjustedProgress) * 10) / 10;
                            const newStatus = determineStatus(newCO, newSmoke);
                            const newTemp = Math.round((sensor.temperature + (targetTemperature - sensor.temperature) * adjustedProgress) * 10) / 10;
                            return { 
                                ...sensor, 
                                temperature: newTemp, 
                                smoke: newSmoke, 
                                CO: newCO, 
                                status: newStatus 
                            };
                        }
                    }
                    return sensor;
                })
            }))
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
    // First ensure stove is on
    rooms.update((roomList) =>
        roomList.map((room) => ({
            ...room,
            sensors: room.sensors.map((sensor) => {
                if (sensor.id === '2' && sensor.type === 'Uttag') {
                    return { ...sensor, status: 'on' };
                }
                return sensor;
            })
        }))
    );
    smoothTransition('false-alarm', 5000);
    notification.set('Simulering av falskt larm startat. Rök från köket påverkar även sovrummet.');
}


	function startFireSimulation(): void {
		isFireSimulation.set(true);
		isFalseAlarm.set(false);
		smoothTransition('fire', 10000);
		notification.set('Brandsimulering startad. Brand upptäckt i köket som sprider sig till sovrummet.');
		triggerNotification();
	}
	function makeEmergencyCall(): void {
		isEmergencyCallActive.set(true);
	}

	let idleInterval: ReturnType<typeof setInterval> | undefined;
	let fireSpreadInterval: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		idleInterval = setInterval(idleVariations, 2000);
	});

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
    newSensorProperties = {status: 'active', batteryLevel: 85, smoke: 0, CO: 0, temperature: 24}
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
			? { batteryLevel: 100, smoke: 0, CO: 0 }
			: selectedSensorType === 'Uttag'
				? { status: 'off' }
				: { temperature: 0 };


	function getStatusColor(value: number) {
		if (value < 20) return 'bg-green-500';
		if (value < 40) return 'bg-yellow-500';
		return 'bg-red-500';
	}

	function getStatusBorder(status: string) {
		switch (status) {
		case 'alarm': return 'border-l-red-500';
		case 'danger': return 'border-l-orange-500';
		case 'warning': return 'border-l-yellow-500';
		default: return 'border-l-gray-200';
		}
	}
</script>



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
								<span>CO:</span>
								<span>{COToString(sensor.CO)}</span>
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
							<h4>{sensor.name || sensor.type}</h4>
						</div>
					</div>
					<div class="sensor-data">
						<span>Status: {sensor.status === 'on' ? 'På' : 'Av'}</span>
					</div>
				</div>
				{:else if sensor.type === 'Temperatur'}
          <div class="sensor-row">
            <div class="sensor-header">
              <div class="card-name-icon">
                <div class="room-icon-circle">
                  <Plug class="text-black-500 h-4 w-4" />
                </div>
                <h4>{sensor.name || sensor.type}</h4>
              </div>
            </div>
            <div class="sensor-data">
              <span>{sensor.temperature} ºC</span>
            </div>
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
					<input
						class="ml-2"
						id="sensor-name"
						type="text"
						placeholder="Sensornamn"
						bind:value={newSensorName}
					/>
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
								<h4>{sensor.name || ''} ({sensor.type})</h4>
								<button class="button" on:click={() => deleteSensor(selectedRoomId, sensor.id)}
									>Ta bort</button
								>
							</div>
						</li>{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>

<div class="mt-6 flex flex-wrap justify-center gap-4">
    <button
        class="rounded bg-[#99bbcf] px-4 py-2 text-white transition-colors hover:bg-[#7a9fb3] focus:outline-none focus:ring-2 focus:ring-[#99bbcf] focus:ring-opacity-50 shadow-md"
        on:click={() => window.location.reload()}
    >
        Återställ Simulation
    </button>
    <button
        class="rounded bg-[#c15564] px-4 py-2 text-white transition-colors hover:bg-[#a94754] focus:outline-none focus:ring-2 focus:ring-[#c15564] focus:ring-opacity-50 shadow-md"
        on:click={startFireSimulation}
        disabled={$isFireSimulation || $isFalseAlarm}
    >
        Starta Brandsimulering
    </button>
    <button
        class="rounded bg-[#a5ba5c] px-4 py-2 text-white transition-colors hover:bg-[#8a9c4c] focus:outline-none focus:ring-2 focus:ring-[#a5ba5c] focus:ring-opacity-50 shadow-md"
        on:click={startFalseAlarm}
        disabled={$isFireSimulation || $isFalseAlarm}
    >
        Simulera Falskt Larm
    </button>
    {#if $isFireSimulation}
        <button
            class="rounded bg-[#99bbcf] px-4 py-2 text-white transition-colors hover:bg-[#7a9fb3] focus:outline-none focus:ring-2 focus:ring-[#99bbcf] focus:ring-opacity-50 shadow-md"
            on:click={makeEmergencyCall}
            disabled={$isEmergencyCallActive}
        >
            Ring SOS Alarm
        </button>
    {/if}
</div>

{#if $isEmergencyCallActive}
    <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        transition:fade={{ delay: 250, duration: 300 }}
    >
        <div class="rounded-lg bg-white p-6 shadow-xl border-l-4 border-[#c15564]">
            <h3 class="mb-4 text-xl font-bold text-[#c15564]">Nödsamtal aktivt</h3>
            <p class="mb-4">Simulerat nödsamtal till räddningstjänsten pågår...</p>
            <div class="flex justify-center">
                <Phone class="h-12 w-12 animate-pulse text-[#c15564]" />
            </div>
            <button
                class="mt-4 rounded bg-[#c15564] px-4 py-2 text-white transition-colors hover:bg-[#a94754] focus:outline-none focus:ring-2 focus:ring-[#c15564] focus:ring-opacity-50 shadow-md"
                on:click={() => isEmergencyCallActive.set(false)}
            >
                Avsluta samtal
            </button>
        </div>
    </div>
{/if}
{#if $notification}
<div class="container mx-auto mt-4">
	<div class="flex items-center justify-center">
		<div class={`${$isFalseAlarm ? 'bg-yellow-500' : 'bg-[#c15564]'} text-white p-4 rounded-l shadow-md`}>
			<AlertCircle class="h-6 w-6 flex-shrink-0" />
		</div>
		<div class={`${$isFalseAlarm ? 'bg-yellow-500' : 'bg-[#c15564]'} p-4 text-white rounded-r shadow-md`}>
			<p>{$notification}</p>
		</div>
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

<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCouch, faUtensils, faBed, faGamepad, faTshirt } from '@fortawesome/free-solid-svg-icons';
  import { writable, type Writable } from 'svelte/store';
  import { Thermometer, Wind, Battery, AlarmSmoke, Pencil } from 'lucide-svelte';
  import { onMount } from 'svelte';

  interface Sensor {
    id: string;
    type: 'brandvarnare' | 'uttag' | 'temp';
    status: string;
    batteryLevel?: number;
    temperature?: number;
    smoke?: number;
    CO2?: number;
  }

  interface Room {
    id: string;
    name: string;
    sensors: Sensor[];
  }

  let rooms: Writable<Room[]> = writable([
    { id: '1', name: 'Kök', sensors: [
      { id: '1', type: 'brandvarnare', status: 'active', batteryLevel: 85, smoke: 0, CO2: 0 },
      { id: '2', type: 'uttag', status: 'off' }
    ]},
    { id: '2', name: 'Sovrum', sensors: [
      { id: '3', type: 'brandvarnare', status: 'active', batteryLevel: 92, smoke: 0, CO2: 0 }
    ]}
  ]);

  let newRoomName = '';
  let showAddRoomModal = writable(false);
  let showAddSensorModal = writable(false);
  let selectedRoomId: string | null = null;
  let firstSmokeLimit = 20; // Low limit for particles in the air
  let secondSmokeLimit = 40; // High limit for particles in the air

  let firstCO2Limit = 20; // Low limit for CO2 in the air
  let secondCO2Limit = 40; // High limit for CO2 in the air

  function addRoom() {
    rooms.update(r => [...r, { id: Date.now().toString(), name: newRoomName, sensors: [] }]);
    newRoomName = '';
    showAddRoomModal.set(false);
  }

  function addSensorToRoom(roomId: string | null) {
    rooms.update(r =>
      r.map(room => 
        room.id === roomId 
        ? { ...room, sensors: [...room.sensors, { id: Date.now().toString(), type: 'brandvarnare', status: 'active' }] }
        : room
      )
    );
    showAddSensorModal.set(false);
  }

  function smokeToString(value: number | null){
    let newValue = value?.toFixed(1);
    if (value?.toFixed(1) != null){
      if(value < firstSmokeLimit){
        return "Low";
      } else if (value >= firstSmokeLimit && value < secondSmokeLimit){
        return "Medium";
      } else{
        return "High!";
      }
    }
  }

  function CO2ToString(value: number | null){
    let newValue = value?.toFixed(1);
    if (value?.toFixed(1) != null){
      if(value < firstCO2Limit){
        return "Low";
      } else if (value >= firstCO2Limit && value < secondCO2Limit){
        return "Medium";
      } else{
        return "High!";
      }
    }
  }
</script>

<!-- Layout: FlameWatch Room Cards with Sensor Integration -->
<div class="app-container">
  <div class="home-header">
    <h1>FlameWatch</h1>
  </div>

  <div class="room-header">
    <h3>Rooms</h3>
    <button on:click={() => showAddRoomModal.set(true)} class="plus-button">
      <Pencil size=19 />
    </button>
  </div>

  <!-- Room Cards -->
  {#each $rooms as room (room.id)}
    <div class="room-card {room.name === 'Kök' ? 'kitchen' :
                           room.name === 'Vardagsrum' ? 'living-room' :
                          room.name === 'Sovrum' ? 'bedroom' : ''}">
     <div class="card-header"> 
      <div class="card-name-icon">
      <span>
        <FontAwesomeIcon icon={
          room.name === 'Kök' ? faUtensils :
          room.name === 'Vardagsrum' ? faCouch :
          room.name === 'Sovrum' ? faBed :
          faTshirt
        } class="icon" />
      </span>
      <h3>{room.name}</h3>
    </div>
        <button on:click={() => { selectedRoomId = room.id; showAddSensorModal.set(true); }} class="plus-button">
          <Pencil size=19 />
        </button>
      </div>

      <!-- List Sensors -->
      {#each room.sensors as sensor (sensor.id)}
        <div class="sensor-row">
          {#if sensor.type === 'brandvarnare'}
            <div class="sensor-header">
              <div>
                <AlarmSmoke class="h-4 w-4 text-blue-500" />
              </div>
              <div class="flex space-x-1">
                <span class="text-[12px]">{sensor.batteryLevel}%</span>
                <Battery class="h-4 w-4 text-green-500"/>
              </div>
            </div>
            <div class="sensor-data">
              <span>Smoke:</span>
              <span>{smokeToString(sensor.smoke)}
              </span>
            </div>
          {:else if sensor.type === 'uttag'}
            <div>Uttag Status: {sensor.status}</div>
            {:else if sensor.type === 'temp'}
            <div>
              <span>{sensor.temperature?.toFixed(1)} °C</span>
            </div>
            {/if}

        </div>
      {/each}
    </div>
  {/each}

  <!-- Add Room Modal -->
  {#if $showAddRoomModal}
    <div class="modal">
      <div class="modal-content">
        <h3>Add Room</h3>
        <input type="text" bind:value={newRoomName} placeholder="Room Name" />
        <button on:click={addRoom}>Add</button>
        <button on:click={() => showAddRoomModal.set(false)}>Cancel</button>
      </div>
    </div>
  {/if}

  <!-- Add Sensor Modal -->
  {#if $showAddSensorModal && selectedRoomId}
    <div class="modal">
      <div class="modal-content">
        <h3>Add Sensor to Room</h3>
        <button on:click={() => addSensorToRoom(selectedRoomId)}>Add Sensor</button>
        <button on:click={() => showAddSensorModal.set(false)}>Cancel</button>
      </div>
    </div>
  {/if}
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
    padding-top: 3px;
		padding-bottom: 15px;
  }

  .card-name-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-name-icon h3{
    padding-left: 10px;
  }

  .home-header h1 {
    font-weight: bold;
  }
  .room-card {
    padding: 15px;
    border-radius: 10px;
    background-color: #ffda23;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
  .sensor-row {
    margin-top: 10px;
  }
  .sensor-header {
    margin-top: 10px;
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
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }

  .room-header {
		color: black;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 7px;
		padding-top: 3px;
	}

  .living-room { background-color: #99bbcf; }
  .kitchen { background-color: #a5ba5c; }
  .bedroom { background-color: #c15564; }

</style>

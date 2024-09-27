<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Card } from 'flowbite-svelte';
    import { FireOutline, BellActiveAltOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';

    // State variables
    let fireStarted: boolean = false;
    let stoveStarted: boolean = false;
    let windowOpened: boolean = true; // Initial state for the window is open
    let particles: number = 0;
    let monoxide: number = 0;
    const minParticles: number = 0;
    const maxParticles: number = 100;
    const minMonoxide: number = 0;
    const maxMonoxide: number = 100;
    const deltaT: number = 1;
    let intervalId: any;

    // Variables for smoke and monoxide detectors
    let smokeDetector: boolean = false;
    let monoxideDetector: boolean = false;

    // Function to calculate particles and monoxide based on stove, fire, and window states
    function calculateParticlesAndMonoxide() {
        const stove = stoveStarted ? 1 : 0;
        const fire = fireStarted ? 1 : 0;

        // Update particles based on stove and fire, subtract if window is opened
        let newParticles = particles + (1 * stove + 2 * fire) * deltaT;
        if (windowOpened) {
            newParticles = Math.max(minParticles, newParticles - 1.5);
        }
        particles = Math.max(minParticles, Math.min(maxParticles, newParticles));

        // Update monoxide based on fire and window state
        let newMonoxide = monoxide + (1 * fire - 1 * (windowOpened ? 1 : 0)) * deltaT;
        monoxide = Math.max(minMonoxide, Math.min(maxMonoxide, newMonoxide));

        // Update smoke detector logic
        smokeDetector = (stoveStarted ? particles > 50 : particles > 40);

        // Update monoxide detector logic
        monoxideDetector = monoxide > 40;
    }

    // Start updating particles and monoxide every second
    onMount(() => {
        intervalId = setInterval(calculateParticlesAndMonoxide, 1000); // Update every second
    });

    // Clean up the interval when the component is destroyed
    onDestroy(() => {
        clearInterval(intervalId);
    });

    // Functions to toggle states
    function toggleFire() {
        fireStarted = !fireStarted; // Toggle fire button state
    }

    function toggleStove() {
        stoveStarted = !stoveStarted; // Toggle stove button state
    }

    function toggleWindow() {
        windowOpened = !windowOpened; // Toggle window button state
    }
</script>

<div class="container mx-auto px-4">
    <!-- Fire Button -->
    <button class="fire-button" on:click={toggleFire}>
        {fireStarted ? "Fire started" : "Start fire"}
    </button>

    <!-- Stove Button -->
    <button class="stove-button" on:click={toggleStove}>
        {stoveStarted ? "Turn off stove" : "Start stove"}
    </button>

    <!-- Window Button -->
    <button class="window-button" on:click={toggleWindow}>
        {windowOpened ? "Open window" : "Close window"}
    </button>

    <!-- Particles Loading Bar -->
    <div class="particles-status">
        <p>Particles</p>
        <div class="loading-bar">
            <div class="loading-fill" style="width: {Math.round((particles / maxParticles) * 100)}%;"></div>
        </div>
    </div>

    <!-- Monoxide Loading Bar -->
    <div class="monoxide-status">
        <p>Monoxide</p>
        <div class="loading-bar">
            <div class="loading-fill monoxide-fill" style="width: {Math.round((monoxide / maxMonoxide) * 100)}%;"></div>
        </div>
    </div>

    <!-- Detector Signs -->
    <div class="detectors">
        <div class="detector smoke-detector" style="color: {smokeDetector ? 'green' : 'red'}">
            <p>Smoke Detector: {smokeDetector ? "True" : "False"}</p>
        </div>
        <div class="detector monoxide-detector" style="color: {monoxideDetector ? 'green' : 'red'}">
            <p>Monoxide Detector: {monoxideDetector ? "True" : "False"}</p>
        </div>
    </div>
</div>

<style>
    .fire-button {
        position: absolute;
        left: 25%;
        padding: 15px 30px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        background-color: #ff4500; /* Fiery red */
        color: white;
        border: none;
        border-radius: 12px;
        transition: background-color 0.3s;
    }

    .stove-button {
        position: absolute;
        left: 25%;
        top: 120px;
        padding: 15px 30px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        background-color: #7f7f7f; /* Metallic gray */
        color: white;
        border: none;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: background-color 0.3s;
    }

    .window-button {
        position: absolute;
        left: 25%;
        top: 240px;
        padding: 15px 30px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        background-color: #87ceeb; /* Sky blue, reminiscent of a window */
        color: white;
        border: none;
        border-radius: 12px;
        transition: background-color 0.3s;
    }

    .particles-status, .monoxide-status {
        position: absolute;
        right: 10%;
        font-size: 20px;
        font-weight: bold;
        color: black;
        width: 25%; /* 50% of original size */
    }

    .particles-status {
        top: 40px;
    }

    .monoxide-status {
        top: 160px;
    }

    .loading-bar {
        width: 100%;
        height: 30px;
        background-color: #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
    }

    .loading-fill {
        height: 100%;
        background-color: #76c7c0;
        transition: width 0.3s;
    }

    .monoxide-fill {
        background-color: #ff0000; /* Red for monoxide fill */
    }

    /* Detector Styles */
    .detectors {
        position: absolute;
        width: 50%;
        top: 400px; /* Positioned below the buttons and loading bars */
        left: 25%;
        text-align: center;
    }

    .detector {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
    }
</style>

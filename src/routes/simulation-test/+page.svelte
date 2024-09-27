<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

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

<div class="container">
    <!-- Left Side: Buttons with border and shadow -->
    <div class="left-border">
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
    </div>

    <!-- Right Side: Loading Bars and Detectors -->
    <div class="right-container">
        <!-- Top Half: Loading Bars -->
        <div class="top-half right-border">
            <div class="particles-status">
                <p>Particles</p>
                <div class="loading-bar">
                    <div class="loading-fill" style="width: {Math.round((particles / maxParticles) * 100)}%;"></div>
                </div>
            </div>

            <div class="monoxide-status">
                <p>Monoxide</p>
                <div class="loading-bar">
                    <div class="loading-fill monoxide-fill" style="width: {Math.round((monoxide / maxMonoxide) * 100)}%;"></div>
                </div>
            </div>
        </div>

        <!-- Bottom Half: Detectors -->
        <div class="bottom-half detector-border">
            <div class="detectors">
                <div class="detector smoke-detector" style="color: {smokeDetector ? 'green' : 'red'}">
                    <p>Smoke Detector: {smokeDetector ? "True" : "False"}</p>
                </div>
                <div class="detector monoxide-detector" style="color: {monoxideDetector ? 'green' : 'red'}">
                    <p>Monoxide Detector: {monoxideDetector ? "True" : "False"}</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Main Layout for Buttons and Bars */
    .container {
        display: flex;
        justify-content: space-between;
        height: 100vh; /* Full viewport height */
        padding: 10px; /* 10px margin around the boxes */
    }

    /* Left Border for Buttons */
    .left-border {
        width: 33%; /* 33% of the page width */
        height: 100%; /* Full height */
        padding: 20px;
        margin-right: 10px; /* Margin to the right of the buttons box */
        border: 2px solid black; /* Thin black border */
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2); /* Shadow */
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    /* Right Side: Group the bars and detectors */
    .right-container {
        width: 67%; /* 67% of the page width */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    /* Top Half for Loading Bars */
    .top-half {
        height: 50%; /* 50% height for the top half (loading bars) */
        padding: 20px;
        margin-bottom: 10px; /* Margin between the top and bottom halves */
    }

    /* Bottom Half for Detectors */
    .bottom-half {
        height: 50%; /* 50% height for the bottom half (detectors) */
        padding: 20px;
    }

    /* Right Border for Loading Bars */
    .right-border {
        border: 2px solid black;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }

    /* Right Border for Detectors */
    .detector-border {
        border: 2px solid black;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }

    /* Buttons Styles */
    .fire-button, .stove-button, .window-button {
        width: 100%;
        padding: 15px 30px;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        border: none;
        border-radius: 12px;
        transition: background-color 0.3s;
    }

    .fire-button {
        background-color: #ff4500;
        color: white;
    }

    .stove-button {
        background-color: #7f7f7f;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .window-button {
        background-color: #87ceeb;
        color: white;
    }

    /* Loading Bars */
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
        text-align: center;
    }

    .detector {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
    }
</style>

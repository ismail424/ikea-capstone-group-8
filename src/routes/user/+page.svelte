<script lang="ts">
    import { ref, onValue } from 'firebase/database';
    import { database } from '../../lib/firebase';  // Import the initialized Firebase DB
  
    // Variables to store the values from Firebase
    let particles = 0;
    let carbonMonoxide = 0;
  
    // Firebase references for the state
    const particlesRef = ref(database, 'simulation/particles');
    const carbonMonoxideRef = ref(database, 'simulation/carbonMonoxide');
  
    // Listen for real-time updates from Firebase and set Svelte variables
    onValue(particlesRef, (snapshot) => {
      particles = snapshot.val();
    });
    onValue(carbonMonoxideRef, (snapshot) => {
      carbonMonoxide = snapshot.val();
    });
  </script>
  
  <!-- Display the values from the Firebase database -->
  <div class="user-data">
    <h1>Simulation Data</h1>
    <p><strong>💨 Particles:</strong> {particles}</p>
    <p><strong>🧴 Carbon Monoxide:</strong> {carbonMonoxide}</p>
  </div>
  
  <style>
    .user-data {
      padding: 20px;
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 10px;
      max-width: 500px;
      margin: auto;
    }
    h1 {
      text-align: center;
      color: #333;
    }
    p {
      font-size: 18px;
      line-height: 1.5;
    }
  </style>
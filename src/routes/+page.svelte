<script>
    import { onMount } from 'svelte';
    let hover = false;
  </script>
  
  <div class="container mx-auto px-4">
    <header class="text-center my-12">
      <img src="chalmers_logo.png" alt="Chalmers Logo" class="mx-auto w-24 mb-4">
      <h1 class="text-4xl font-bold">Capstone Software Innovation</h1>
      <h2 class="text-2xl mt-4">How might we leverage smart home data to feel safer in Europe?</h2>
    </header>
  
    <section class="my-12">
      <h3 class="text-3xl font-semibold mb-4">Overview and Initial Demo</h3>
      <p>
        Our software innovation addresses the needs of individuals often away from home, making them feel secure by combining multiple smart home features into a single, intuitive solution at an affordable cost.
      </p>
      <div class="mt-4">
        <button class="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded" on:click={() => window.location.href='/simulation'}>
          See Simulation
        </button>
 
      </div>
    </section>
  
    <section class="my-12">
      <h3 class="text-3xl font-semibold mb-4">About Smart Brandvarnare</h3>
      <p>
        The smart smoke detector, or Brandvarnare, is a vital part of our smart home solution. It uses advanced sensors to detect smoke and fire, ensuring that immediate action can be taken to avoid any potential danger. Here are some features of our Brandvarnare:
      </p>
      <ul class="list-disc list-inside mt-4">
        <li>Real-time smoke and fire detection</li>
        <li>Instant notifications sent to your mobile device</li>
        <li>Integrated with the IKEA Smart Home app for easy management</li>
        <li>Durable and battery-efficient design</li>
        <li>Ability to distinguish between cooking smoke and actual fire</li>
      </ul>
      <p class="mt-4">
        Our Brandvarnare is designed to provide peace of mind, knowing that your home is being monitored for potential dangers, even when you are not there.
      </p>
    </section>
  
    <section class="my-12">
      <h3 class="text-3xl font-semibold mb-4">How It Fulfills Design Thinking Principles</h3>
      <div class="p-6 rounded-lg shadow-lg border">
        <h4 class="text-2xl">Empathy</h4>
        <p>
          Our product addresses the core concerns of our target users - security, property management, and communication challenges.
        </p>
        <h4 class="text-2xl mt-4">Define</h4>
        <p>
          We refined our understanding based on interviews and immersion, identifying the key problem that our product addresses.
        </p>
        <h4 class="text-2xl mt-4">Ideate</h4>
        <p>
          We brainstormed and benchmarked different approaches, prioritizing feasibility, desirability, and alignment with IKEA's values.
        </p>
      </div>
    </section>
  
    <section class="my-12">
      <h3 class="text-3xl font-semibold mb-4">Background Information</h3>
      <img src="/static/team-photo.jpg" alt="Team Photo" class="w-48 mx-auto rounded-full mb-4">
      <p><strong>Team Members:</strong></p>
      <ul class="list-disc list-inside">
        <li>Member 1 (email@example.com)</li>
        <li>Member 2 (email@example.com)</li>
        <li>Member 3 (email@example.com)</li>
        <li>Member 4 (email@example.com)</li>
      </ul>
    </section>
  
    <section class="my-12">
      <h3 class="text-3xl font-semibold mb-4">References</h3>
      <ul class="list-disc list-inside">
        <li><a href="https://kit.svelte.dev/docs" class="text-blue-600">SvelteKit Documentation</a></li>
        <li><a href="https://tailwindcss.com/docs" class="text-blue-600">Tailwind CSS Documentation</a></li>
        <li><a href="https://flowbite.com/docs/getting-started/quickstart/" class="text-blue-600">Flowbite Quickstart</a></li>
        <li>... (Other References)</li>
      </ul>
    </section>
  </div>
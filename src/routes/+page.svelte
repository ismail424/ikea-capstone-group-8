<script>
  import { onMount } from 'svelte';
  let hover = false;
</script>

<div class="container mx-auto px-4 lg:px-8">
  <!-- Header Section -->
  <header class="text-center my-12">
      <img src="chalmers_logo.png" alt="Chalmers Logo" class="mx-auto w-32 mb-6">
      <h1 class="text-5xl font-bold leading-tight">FlameWatch</h1>

      <h2 class="text-2xl font-light text-gray-500 mt-6">
          Leveraging Smart Home Data for Enhanced Safety in Europe
      </h2>
  </header>

<!-- Project Overview Section -->
<section class="my-20 bg-white py-16 px-6 md:px-12 lg:px-20 rounded-xl shadow-xl max-w-7xl mx-auto">
  <div class="text-center mb-10">
      <h3 class="text-4xl font-bold text-gray-800 mb-4">Project Overview and Initial Demo</h3>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Our cutting-edge software solution integrates smart home technologies into an intuitive platform, enhancing security for individuals frequently away from home. It is designed to be affordable, user-friendly, and deliver peace of mind.
      </p>
  </div>

  <div class="flex justify-center mt-10">
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              on:click={() => window.location.href='/simulation'}>
          View Simulation
      </button>
  </div>
</section>


<!-- Smart Brandvarnare Section -->
<section class="my-20 bg-white py-16 px-6 md:px-12 lg:px-20 rounded-xl shadow-xl max-w-7xl mx-auto">
  <div class="text-center mb-12">
    <h3 class="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">Discover Smart Brandvarnare</h3>
    <p class="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
      A crucial component of our smart home ecosystem, the Smart Brandvarnare ensures rapid detection of smoke and fire, empowering you to act swiftly. It comes packed with advanced features that make your home safer and smarter.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    <!-- Feature 1 -->
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center space-x-4 mb-4">
        <div class="bg-indigo-500 p-4 rounded-full text-white">
          <!-- Smoke detection icon -->
          <i class="fas fa-bell text-xl"></i>
        </div>
        <h4 class="text-xl font-semibold text-gray-800">Real-time Detection</h4>
      </div>
      <p class="text-gray-600 leading-relaxed">
        Detects smoke and fire instantly, providing real-time alerts to prevent damage.
      </p>
    </div>

    <!-- Feature 2 -->
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center space-x-4 mb-4">
        <div class="bg-indigo-500 p-4 rounded-full text-white">
          <!-- Notification icon -->
          <i class="fas fa-mobile-alt text-xl"></i>
        </div>
        <h4 class="text-xl font-semibold text-gray-800">Instant Alerts</h4>
      </div>
      <p class="text-gray-600 leading-relaxed">
        Sends immediate notifications to your smartphone, ensuring you're always aware.
      </p>
    </div>

    <!-- Feature 3 -->
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center space-x-4 mb-4">
        <div class="bg-indigo-500 p-4 rounded-full text-white">
          <!-- Integration icon -->
          <i class="fas fa-link text-xl"></i>
        </div>
        <h4 class="text-xl font-semibold text-gray-800">App Integration</h4>
      </div>
      <p class="text-gray-600 leading-relaxed">
        Seamlessly integrates with the IKEA Smart Home app for remote monitoring.
      </p>
    </div>

    <!-- Feature 4 -->
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center space-x-4 mb-4">
        <div class="bg-indigo-500 p-4 rounded-full text-white">
          <!-- Energy-efficient icon -->
          <i class="fas fa-battery-half text-xl"></i>
        </div>
        <h4 class="text-xl font-semibold text-gray-800">Energy Efficiency</h4>
      </div>
      <p class="text-gray-600 leading-relaxed">
        Designed for long-lasting performance while conserving energy efficiently.
      </p>
    </div>

    <!-- Feature 5 -->
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center space-x-4 mb-4">
        <div class="bg-indigo-500 p-4 rounded-full text-white">
          <!-- Fire distinction icon -->
          <i class="fas fa-fire-alt text-xl"></i>
        </div>
        <h4 class="text-xl font-semibold text-gray-800">Smart Detection</h4>
      </div>
      <p class="text-gray-600 leading-relaxed">
        Intelligently distinguishes between normal cooking smoke and real fire.
      </p>
    </div>

    <!-- Feature 6 -->
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center space-x-4 mb-4">
        <div class="bg-indigo-500 p-4 rounded-full text-white">
          <!-- Protection icon -->
          <i class="fas fa-shield-alt text-xl"></i>
        </div>
        <h4 class="text-xl font-semibold text-gray-800">Continuous Protection</h4>
      </div>
      <p class="text-gray-600 leading-relaxed">
        Provides round-the-clock monitoring to keep your home safe, even when you're away.
      </p>
    </div>
  </div>

  <p class="mt-12 text-lg text-gray-700 text-center max-w-4xl mx-auto">
    The Smart Brandvarnare offers unparalleled protection, ensuring your home is monitored for fire hazards even when you're far from home.
  </p>

  <div class="mt-8 text-center">
    <a href="#" class="inline-block bg-indigo-600 text-white text-lg py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400">
      Learn More
    </a>
  </div>
</section>



  <!-- Design Thinking Principles Section -->
  <section class="my-16">
      <h3 class="text-3xl font-semibold text-gray-700 mb-8 text-center">Aligning with Design Thinking Principles</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h4 class="text-xl font-bold text-gray-700 mb-4">Usability</h4>
              <p class="text-gray-600">
                    Many users expressed concerns about potential home issues, like forgetting to turn off appliances or water leaks, especially when away. While safety measures exist, people often feel powerless when they're not home. Our smart fire alarm addresses this by providing real-time notifications if a fire starts, enabling users to take immediate action by contacting emergency services, even from afar. This added layer of control offers peace of mind, enhancing both security and convenience.
              </p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h4 class="text-xl font-bold text-gray-700 mb-4">Feasibility</h4>
              <p class="text-gray-600">
                    Our smart fire alarm is highly feasible because the technology smoke detectors, wireless connectivity, and app notifications is well-established. Since IKEA already has a hub for its smart home products, our fire alarm could easily connect using the same protocols as other IKEA smart home products. This integration would not require new, untested technologies, making it both practical and cost-effective to implement
              </p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h4 class="text-xl font-bold text-gray-700 mb-4">Viability</h4>
              <p class="text-gray-600">
                    Our smart fire alarm aligns well with IKEA's vision of creating a better everyday life for many. By introducing a safety-focused product, IKEA can enhance its portfolio while staying true to its commitment to affordability and innovation.

                    This solution resonates with IKEA's core values of accessibility and sustainability, reinforcing its reputation as a leader in home solutions. With growing consumer demand for smart home devices and safety products, our fire alarm is a timely addition that offers upselling opportunities within their existing ecosystem. Additionally, designing the product with eco-friendly materials supports IKEA’s sustainability goals. Overall, this smart fire alarm presents a strategic opportunity for IKEA to drive profitability while remaining aligned with its vision and values.
              </p>
          </div>
      </div>
  </section>

  <!-- Team Section -->
  <section class="my-16">
      <h3 class="text-3xl font-semibold text-gray-700 mb-8 text-center">Meet the Team</h3>
      <div class="flex flex-col items-center space-y-8">
          <img src="/static/team-photo.jpg" alt="Team Photo" class="w-48 h-48 object-cover rounded-full shadow-md mb-6">
          <p class="text-lg font-semibold text-gray-700">Team Members:</p>
          <ul class="list-disc list-inside text-lg text-gray-600">
              <li><a href="mailto:email@example.com" class="text-indigo-600 hover:text-indigo-800">Member 1</a></li>
              <li><a href="mailto:email@example.com" class="text-indigo-600 hover:text-indigo-800">Member 2</a></li>
              <li><a href="mailto:email@example.com" class="text-indigo-600 hover:text-indigo-800">Member 3</a></li>
              <li><a href="mailto:email@example.com" class="text-indigo-600 hover:text-indigo-800">Member 4</a></li>
          </ul>
      </div>
  </section>

  <!-- References Section -->
  <section class="my-16 bg-gray-50 py-12 px-6 rounded-lg shadow-md">
      <h3 class="text-3xl font-semibold text-gray-700 mb-8 text-center">References</h3>
      <ul class="list-disc list-inside text-lg text-gray-600">
          <li><a href="https://kit.svelte.dev/docs" class="text-indigo-600 hover:text-indigo-800">SvelteKit Documentation</a></li>
          <li><a href="https://tailwindcss.com/docs" class="text-indigo-600 hover:text-indigo-800">Tailwind CSS Documentation</a></li>
          <li><a href="https://flowbite.com/docs/getting-started/quickstart/" class="text-indigo-600 hover:text-indigo-800">Flowbite Quickstart</a></li>
          <li>... (Additional References)</li>
      </ul>
  </section>
</div>

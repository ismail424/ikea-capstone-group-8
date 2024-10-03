<script>
	import { onMount } from 'svelte';
	let hover = false;
</script>

<div class="container mx-auto px-4 lg:px-8">
	<!-- Header Section -->
	<header class="my-12 text-center">
		<img src="chalmers_logo.png" alt="Chalmers Logo" class="mx-auto mb-6 w-32" />
		<h1 class="text-5xl font-bold leading-tight">FlameWatch</h1>

		<!-- Undertitle for FlameWatch -->
		<h2 class="mt-2 text-3xl font-semibold text-black-700">TEK830</h2>
		
		<h2 class="mt-6 text-2xl font-light text-gray-500">
			Leveraging Smart Home Data for Enhanced Safety in Europe
		</h2>
	</header>


	<!-- Project Overview Section -->
	<section
		class="mx-auto my-20 max-w-7xl rounded-xl bg-white px-6 py-16 shadow-xl md:px-12 lg:px-20"
	>
		<div class="mb-10 text-center">
			<h3 class="mb-4 text-4xl font-bold text-gray-800">Project Overview</h3>
			<p class="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
				With more people spending time away from their homes, ensuring safety from potential fire
				hazards is becoming increasingly important. Traditional fire alarms might go unnoticed when
				no one is home, creating a gap in security.
			</p>
		</div>
	</section>

	<!-- Smart Fire Alarm Section -->
	<section
		class="mx-auto my-20 max-w-7xl rounded-xl bg-white px-6 py-16 shadow-xl md:px-12 lg:px-20"
	>
		<div class="mb-12 text-center">
			<h3 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-800">Discover FlameWatch</h3>
			<p class="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700">
				FlameWatch, a smart fire alarm and a key part of our smart home ecosystem, ensures rapid
				detection of smoke and fire, empowering you to act swiftly. It comes packed with advanced
				features that make your home safer and smarter.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
			<!-- Feature 1 -->
			<div class="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<div class="mb-4 flex items-center space-x-4">
					<div class="rounded-full bg-indigo-500 p-4 text-white">
						<!-- Smoke detection icon -->
						<i class="fas fa-bell text-xl"></i>
					</div>
					<h4 class="text-xl font-semibold text-gray-800">Real-time Detection</h4>
				</div>
				<p class="leading-relaxed text-gray-600">
					Detects smoke and fire instantly, providing real-time alerts to prevent damage.
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<div class="mb-4 flex items-center space-x-4">
					<div class="rounded-full bg-indigo-500 p-4 text-white">
						<!-- Notification icon -->
						<i class="fas fa-mobile-alt text-xl"></i>
					</div>
					<h4 class="text-xl font-semibold text-gray-800">Instant Alerts</h4>
				</div>
				<p class="leading-relaxed text-gray-600">
					Sends immediate notifications to your smartphone, ensuring you're always aware.
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<div class="mb-4 flex items-center space-x-4">
					<div class="rounded-full bg-indigo-500 p-4 text-white">
						<!-- Fire distinction icon -->
						<i class="fas fa-fire-alt text-xl"></i>
					</div>
					<h4 class="text-xl font-semibold text-gray-800">Smart Detection</h4>
				</div>
				<p class="leading-relaxed text-gray-600">
					Intelligently distinguishes between normal cooking smoke and real fire.
				</p>
			</div>

			<!-- Feature 4 -->
			<div class="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<div class="mb-4 flex items-center space-x-4">
					<div class="rounded-full bg-indigo-500 p-4 text-white">
						<!-- Integration icon -->
						<i class="fas fa-link text-xl"></i>
					</div>
					<h4 class="text-xl font-semibold text-gray-800">App Integration</h4>
				</div>
				<p class="leading-relaxed text-gray-600">
					Seamlessly integrates with the IKEA Smart Home app for remote monitoring.
				</p>
			</div>

			<!-- Feature 5 -->
			<div class="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<div class="mb-4 flex items-center space-x-4">
					<div class="rounded-full bg-indigo-500 p-4 text-white">
						<!-- Energy-efficient icon -->
						<i class="fas fa-battery-half text-xl"></i>
					</div>
					<h4 class="text-xl font-semibold text-gray-800">Multi-Room Coverage</h4>
				</div>
				<p class="leading-relaxed text-gray-600">
					Designed to monitor multiple rooms or areas of the home, providing comprehensive
					protection with just one integrated system.
				</p>
			</div>

			<!-- Feature 6 -->
			<div class="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<div class="mb-4 flex items-center space-x-4">
					<div class="rounded-full bg-indigo-500 p-4 text-white">
						<!-- Protection icon -->
						<i class="fas fa-shield-alt text-xl"></i>
					</div>
					<h4 class="text-xl font-semibold text-gray-800">Continuous Protection</h4>
				</div>
				<p class="leading-relaxed text-gray-600">
					Provides round-the-clock monitoring to keep your home safe, even when you're away.
				</p>
			</div>
		</div>

		<p class="mx-auto mt-12 max-w-4xl text-center text-lg text-gray-700">
			The Smart Fire Alarm offers unparalleled protection, ensuring your home is monitored for fire
			hazards even when you're far from home.
		</p>
	</section>

	<!-- Design Thinking Principles Section -->
	<section class="my-16">
		<h3 class="mb-8 text-center text-3xl font-semibold text-gray-700">
			Aligning with Design Thinking Principles
		</h3>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
				<h4 class="mb-4 text-xl font-bold text-gray-700">Usability</h4>
				<p class="text-gray-600">
					Many users expressed concerns about potential home issues, like forgetting to turn off
					appliances or water leaks, especially when away. While safety measures exist, people often
					feel powerless when they're not home. Our smart fire alarm addresses this by providing
					real-time notifications if a fire starts, enabling users to take immediate action by
					contacting emergency services, even from afar. This added layer of control offers peace of
					mind, enhancing both security and convenience.
				</p>
			</div>
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
				<h4 class="mb-4 text-xl font-bold text-gray-700">Feasibility</h4>
				<p class="text-gray-600">
					Our smart fire alarm is highly feasible because the technology smoke detectors, wireless
					connectivity, and app notifications is well-established. Since IKEA already has a hub for
					its smart home products, our fire alarm could easily connect using the same protocols as
					other IKEA smart home products. This integration would not require new, untested
					technologies, making it both practical and cost-effective to implement
				</p>
			</div>
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
				<h4 class="mb-4 text-xl font-bold text-gray-700">Viability</h4>
				<p class="text-gray-600">
					Our smart fire alarm naturally fits with IKEA’s brand by enhancing everyday safety in an
					affordable and practical way. The solution aligns with IKEA’s vision of creating a better
					everyday life and its business idea of providing functional, accessible home solutions. It
					embodies IKEA’s core values of innovation and problem-solving and can be easily integrated
					into IKEA’s existing ecosystem, complementing its home solutions and supporting the
					company’s commitment to sustainability and well-being.
				</p>
			</div>
		</div>
	</section>

	<section
		class="mx-auto my-20 max-w-7xl rounded-xl bg-white px-6 py-16 shadow-xl md:px-12 lg:px-20"
	>
		<div class="mb-10 text-center">
			<h3 class="mb-4 text-4xl font-bold text-gray-800">Initial Demo</h3>
			<p class="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
				Experience how FlameWatch responds to fire hazards in real-time as well our integration with
				IKEA Home smart. This simulation showcases the key features and functionality of our smart
				fire alarm, giving you a firsthand look at how it can keep your home safe.
			</p>
		</div>

		<div class="mt-10 flex justify-center">
			<button
				class="transform rounded-full bg-indigo-600 px-10 py-4 text-lg font-medium text-white shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300"
				on:click={() => (window.location.href = '/simulation/app-Home')}
			>
				View Simulation
			</button>
		</div>
	</section>

	<!-- Team Section -->
	<section class="my-16">
		<h3 class="mb-8 text-center text-3xl font-semibold text-gray-700">Meet the Team</h3>
		<div class="flex flex-col items-center space-y-8">
			<p class="text-lg font-semibold text-gray-700">Team Members:</p>
			<ul class="list-inside list-disc text-lg text-gray-600">
				<li>
					<a href="mailto:tobiaspe@chalmers.se" class="text-indigo-600 hover:text-indigo-800"
						>Tobias Pettersson</a
					>
				</li>
				<li>
					<a href="mailto:email@example.com" class="text-indigo-600 hover:text-indigo-800"
						>Ken Phu</a
					>
				</li>
				<li>
					<a href="mailto:ismailh@chalmers.se" class="text-indigo-600 hover:text-indigo-800"
						>Ismail Al Horan</a
					>
				</li>
				<li>
					<a href="mailto:email@example.com" class="text-indigo-600 hover:text-indigo-800"
						>Ismail Sacic</a
					>
				</li>
				<li>
					<a href="mailto:erking@chalmers.se" class="text-indigo-600 hover:text-indigo-800"
						>Filip Erking</a
					>
				</li>
				<li>
					<a href="mailto:simonada@chalmers.se" class="text-indigo-600 hover:text-indigo-800"
						>Simon Adamsson</a
					>
				</li>
			</ul>
		</div>
	</section>

	<!-- References Section -->
	<section class="my-16 rounded-lg bg-gray-50 px-6 py-12 shadow-md">
		<h3 class="mb-8 text-center text-3xl font-semibold text-gray-700">References</h3>
		<ul class="list-inside list-disc text-lg text-gray-600">
			<li>
				<a href="https://kit.svelte.dev/docs" class="text-indigo-600 hover:text-indigo-800"
					>SvelteKit Documentation</a
				>
			</li>
			<li>
				<a href="https://tailwindcss.com/docs" class="text-indigo-600 hover:text-indigo-800"
					>Tailwind CSS Documentation</a
				>
			</li>
			<li>
				<a
					href="https://flowbite.com/docs/getting-started/quickstart/"
					class="text-indigo-600 hover:text-indigo-800">Flowbite Quickstart</a
				>
			</li>
			<li>... (Additional References)</li>
		</ul>
	</section>
</div>

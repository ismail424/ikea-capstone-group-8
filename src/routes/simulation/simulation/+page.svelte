<script>
	import {
		faLightbulb,
		faPlug,
		faCouch,
		faUtensils,
		faBed,
		faGamepad,
		faTshirt,
		faHome,
		faSun,
		faPlus,
		faHouseFire
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
    import { Flame, Home, Thermometer, Wind, AlertCircle, Phone, Battery, Clock } from 'lucide-svelte';
	import { FaceExplodeOutline } from 'flowbite-svelte-icons';
</script>

<div class="app-container">
	<div class="home-header">
		<h1>FlameWatch</h1>
	</div>

	<div class="room-header"><h3>Rooms</h3></div>

	<!-- Room Cards -->
	<div class="rooms">

		<div class="room-card living-room">
            <div class="card-header">
			<span><FontAwesomeIcon icon={faCouch} class="icon" /></span>
            <h3>Living Room</h3>
            <div class="alarm-oval">Alarm</div>
            <span><FontAwesomeIcon icon={faPlus} class="icon" /></span>
        </div>
			
			<div class="room-product-icons">
                    <Thermometer class="h-4 w-4 text-blue-500" />
                    <span> 37,5 °C</span>
                    </div>
		</div>

		<div class="room-card kitchen">
			<FontAwesomeIcon icon={faUtensils} class="icon" />
			<h3>Kitchen</h3>
			<div class="room-product-icons">
				<div class="room-icon-circle">
					<FontAwesomeIcon icon={faLightbulb} class="product-icon" />
				</div>
				<a href="../simulation">
					<div class="room-icon-circle">
						<FontAwesomeIcon icon={faHouseFire} class="product-icon" />
					</div>
				</a>
			</div>
		</div>

		<div class="room-card gaming">
			<FontAwesomeIcon icon={faGamepad} class="icon" />
			<h3>Gaming</h3>
			<div class="room-product-icons">
				<div class="room-icon-circle">
					<FontAwesomeIcon icon={faLightbulb} class="product-icon" />
				</div>
			</div>
		</div>

		<div class="room-card bedroom">
			<FontAwesomeIcon icon={faBed} class="icon" />
			<h3>Bedroom</h3>
			<div class="room-product-icons">
				<div class="room-icon-circle">
					<FontAwesomeIcon icon={faPlug} class="product-icon" />
				</div>
			</div>
		</div>

		<div class="room-card dining-room">
			<FontAwesomeIcon icon={faUtensils} class="icon" />
			<h3>Dining Room</h3>
			<div class="room-product-icons">
				<div class="room-icon-circle">
					<FontAwesomeIcon icon={faLightbulb} class="product-icon" />
				</div>
			</div>
		</div>

		<div class="room-card laundry-room">
			<FontAwesomeIcon icon={faTshirt} class="icon" />
			<h3>Laundry Room</h3>
			<div class="room-product-icons">
				<div class="room-icon-circle">
					<FontAwesomeIcon icon={faLightbulb} class="product-icon" />
				</div>
			</div>
		</div>
	</div>
</div>

<!-- CSS -->
<style>
	.app-container {
		max-width: 375px; /* making it look like an app on a phone */
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
		padding-bottom: 15px;
	}

	.action-h3 {
		margin-left: 10px;
	}

	.room-header {
		color: black;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 3px;
		padding-top: 3px;
	}

    .progressbar {
    	display: flex;
		justify-items: space-between;
		padding-bottom: 8px;
		padding-top: 30px;
	}

	.actions {
		display: flex;
		justify-content: space-between;
	}

	.action-card {
		flex: 1;
		margin: 5px;
		display: flex;
		padding: 15px;
		background-color: #fff;
		border-radius: 10px;
		text-align: left;
		align-items: center;
	}

	.rooms {
		display: grid;
		grid-template-columns: repeat(1 , 1fr);
		grid-gap: 10px;
	}

	.room-card {
		padding: 13px;
		border-radius: 10px;
		color: black;
		text-align: left;
	}

	.living-room {
		background-color: #99bbcf;
	}
	.kitchen {
		background-color: #a5ba5c;
	}
	.gaming {
		background-color: #f5e05b;
	}
	.bedroom {
		background-color: #c15564;
	}
	.dining-room {
		background-color: #d3aa4c;
	}
	.laundry-room {
		background-color: #aaa1c8;
	}

	.icon {
		color: black;   
		font-size: 1.5rem;
		margin-bottom: 10px;

	}

	.action-icon {
		color: black;
		font-size: 2rem;
	}

	.action-card:hover {
		background-color: #f0f0f0;
		transition: background-color 0.3s ease;
	}

	.product-icon {
		color: black;
		display: flex;
		justify-content: flex-start;
		gap: 10px;
		margin-top: 20px;
	}

	.room-icon-circle {
		background-color: white;
		color: black;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 5px;
	}

    .alarm-oval {
		background-color: rgb(255, 74, 74);
		color: black;
		border-radius: 50px;
		width: 70px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 5px;
		margin-left: 1px;

	}

	.room-product-icons {
		color: black;
		font-size: 1rem;
		margin: 0;
		display: flex;
		justify-items: space-between;
	}

	.room-card:hover {
		filter: brightness(1.1);
		transition: background-color 0.3s ease;
	}
	.room-product-icons a {
		text-decoration: none;
	}

	h3 {
		margin: 0;
	}
</style>

<script>
import { faLightbulb, faPlug, faCouch, faUtensils, faBed, faGamepad, faTshirt, faHome, faSun, faPlus, faHouseFire } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { FaceExplodeOutline } from 'flowbite-svelte-icons';
  </script>
  
  <style>
    .app-container {
      max-width: 375px; /* Phone width */
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
  
    .action-h3 {
      margin-left: 10px;
    }

    .room-header {
        color: black;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
    }
  
    .room-card {
      padding: 13px;
      border-radius: 10px;
      color: black;
      text-align: left; /* Align everything to the left */
    }
  
    /* Room-specific colors */
    .living-room { background-color: #99BBCF; }
    .kitchen { background-color: #A5BA5C; }
    .gaming { background-color: #F5E05B; }
    .bedroom { background-color: #C15564; }
    .dining-room { background-color: #D3AA4C; }
    .laundry-room { background-color: #AAA1C8; }
  
    .icon {
      color: black;
      font-size: 1.5rem;
      margin-bottom: 10px; /* Add space between the icon and the header */
    }
  
    .action-icon {
      color: black;
      font-size: 2rem;
    }

    .action-card:hover {
    background-color: #f0f0f0; /* Light gray background on hover */
    transition: background-color 0.3s ease; /* Smooth transition */
}
  
    .product-icon {
      color: black;
      display: flex;
      justify-content: flex-start; /* Align icons to the left */
      gap: 10px;
      margin-top: 20px; /* Increase the gap between room header and icons */
    }

    .room-icon-circle {
      background-color: white; /* White circle background */
      color: black;
      border-radius: 50%; /* Make it circular */
      width: 30px; /* Fixed width for the circle */
      height: 30px; /* Fixed height for the circle */
      display: flex; /* Centering the icon */
      align-items: center;
      justify-content: center;
      margin-right: 5px;
    }

    .room-product-icons {
      color: black; /* Black icon color */
      font-size: 1rem; /* Adjust size if needed */
      margin: 0; /* Remove default margin */
      display: flex;
      justify-items: flex-start;
    }

    .room-card:hover {
    filter: brightness(1.1); /* Light gray background on hover */
    transition: background-color 0.3s ease; /* Smooth transition */
    }
    .room-product-icons a {
    text-decoration: none; /* Remove underline */
}
  
    h3 {
      margin: 0;
    }

  </style>
  
  <div class="app-container">
    <!-- Header Section -->
    <div class="home-header">
      <h1>My Home</h1>
      <span><FontAwesomeIcon icon={faPlus} class="icon"/></span> <!-- Icon placeholder -->
    </div>
    <!-- Action Cards -->
    <div class="actions">
        <div class="action-card">
            <FontAwesomeIcon icon={faHome} class="action-icon" />
            <h3 class="action-h3">Leaving home</h3>
        </div>
        <div class="action-card">
            <FontAwesomeIcon icon={faSun} class="action-icon" />
            <h3 class="action-h3">Good morning</h3>
        </div>
    </div>
    
    <div class="room-header"><h3>Rooms</h3></div>
  
    <!-- Room Cards with Left-aligned Content and Increased Gap -->
    <div class="rooms">
        <div class="room-card living-room">
            <span><FontAwesomeIcon icon={faCouch} class="icon" /></span>
          <h3>Living Room</h3>
          <div class="room-product-icons">
            <div class="room-icon-circle">
              <FontAwesomeIcon icon={faLightbulb} class="product-icon" />
            </div>
            <div class="room-icon-circle">
              <FontAwesomeIcon icon={faPlug} class="room-icon" />
            </div>
          </div>
        </div>
  
        <div class="room-card kitchen">
            <FontAwesomeIcon icon={faUtensils} class="icon" />
            <h3>Kitchen</h3>
            <div class="room-product-icons">
              <div class="room-icon-circle">
                <FontAwesomeIcon icon={faLightbulb} class="product-icon" />
              </div>
              <a href="../simulation"> <!-- Change this to your target page -->
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
  
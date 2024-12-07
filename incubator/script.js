// Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

setInterval(checkConnection, 5000);

// Reference to your Firebase database
const dbRef = firebase.database().ref();
let prevValues = { humidifier: 0, humidity: 0, distance: 0, fan: 0 }; // Initialize previous values

var toggle = "";
var fans = 0; // Assuming the initial state of the fan is off
var humidifiers = 0; // Assuming the initial state of the humidifier is off

// Function to update the meter display
function updateMeter(data) {
    const { humidifier, humidity, distance, fan } = data;
    // Update elements based on data
    const needle1 = document.getElementById('s1');
    const needle2 = document.getElementById('s2');

    // Assuming temperature represents a percentage from 0 to 100
    const rotation1 = (humidity * 2.4) - 120;
    const rotation2 = ((distance / 4.0) * 2.4) - 120;

    // Display readings
    document.getElementById("meter1").textContent = `Humidity: ${humidity}%`;
    document.getElementById("meter2").textContent = `Distance: ${distance}cm`;

    if (rotation1 > 120) {
        document.getElementById("meter1").style.background = `red`;
        document.getElementById("meter2").style.background = `-`;
        needle1.style.transform = `translate(-2px , -65px) rotate(120deg)`;
        needle2.style.transform = `translate(-2px , -65px) rotate(${rotation2}deg)`;
    }
    else if (rotation2 > 120) {
        document.getElementById("meter2").style.background = `red`;
        document.getElementById("meter1").style.background = `-`;
        needle2.style.transform = `translate(-2px , -65px) rotate(120deg)`;
        needle1.style.transform = `translate(-2px , -65px) rotate(${rotation1}deg)`;
    } else {
        // Rotate the needles
        document.getElementById("meter1").style.background = `-`;
        document.getElementById("meter2").style.background = `-`;
        needle1.style.transform = `translate(-2px , -65px) rotate(${rotation1}deg)`;
        needle2.style.transform = `translate(-2px , -65px) rotate(${rotation2}deg)`;
    }

    // Store the current values as the previous values
    prevValues = data;

    if (humidifier === 0) {
        document.getElementById('humidifier').style.background = "linear-gradient(-315deg, #ff0000,#810606, #ff0000)";
        document.getElementById('humidifier').textContent = "OFF";
    } else {
        document.getElementById('humidifier').style.background = "linear-gradient(-315deg,#1eff00 ,#148106, #1eff00)";
        document.getElementById('humidifier').textContent = "ON";
    }
    
    if (fan === 0) {
        document.getElementById('fan').style.background = "linear-gradient(-315deg, #ff0000,#810606, #ff0000)";
        document.getElementById('fan').textContent = "OFF";
    } else {
        document.getElementById('fan').style.background = "linear-gradient(-315deg,#1eff00 ,#148106, #1eff00)";
        document.getElementById('fan').textContent = "ON";
    }

    humidifiers = humidifier;
    fans = fan;
}

function refresh() {
    const needle1 = document.getElementById('s1');
    const needle2 = document.getElementById('s2');

    needle1.style.transform = `translate(-2px , -65px) rotate(120deg)`;
    needle2.style.transform = `translate(-2px , -65px) rotate(120deg)`;

    setTimeout(() => {
        updateMeter(prevValues);
    }, 1200);
}

function checkConnection() {
    const statusDiv = document.getElementById('status');
    // Check if connected to the internet
    if (navigator.onLine) {
        statusDiv.textContent = "Online";
        // Check if connected to Firebase
        const connectedRef = firebase.database().ref(".info/connected");
        connectedRef.once("value", (snapshot) => { // Use 'once' to avoid adding multiple listeners
            if (snapshot.val() === true) {
                statusDiv.textContent = "Online.\nConnected to Firebase.";
                statusDiv.style.background = "#00ff33";
            } else {
                statusDiv.textContent = "Online.\nNot connected to Firebase.";
                statusDiv.style.background = "red";
                document.getElementById("meter1").textContent = `-`;
                document.getElementById("meter2").textContent = `-`;
            }
        });
    } else {
        statusDiv.textContent = "Offline";
        statusDiv.style.background = "red";
    }
}

// Fetch initial data when the page loads
dbRef.once('value', function (snapshot) {
    const data = snapshot.val();
    updateMeter(data);
});

// Real-time listener for changes in Firebase database
dbRef.on('value', function (snapshot) {
    const data = snapshot.val();
    // Check if the values have changed
    if (JSON.stringify(data) !== JSON.stringify(prevValues)) {
        updateMeter(data);
    }
});

// Initialize the needle position
document.addEventListener('DOMContentLoaded', () => {
    checkConnection();
    refresh();
    // Remove or define updateTemperature and initialTemperature if not used
    // updateTemperature(initialTemperature);
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'f' || event.key === 'F') {
        toggleFullScreen();
    }
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}   

// Fetch the initial state of the fan and humidifier from Firebase
function fetchDeviceState() {
    firebase.database().ref('fan').once('value')
        .then((snapshot) => {
            fans = snapshot.val() || 0; // Default to 0 if no value exists
            console.log("Initial fan state:", fans);
        })
        .catch((error) => {
            console.error("Error fetching fan state:", error);
        });

    firebase.database().ref('humidifier').once('value')
        .then((snapshot) => {
            humidifiers = snapshot.val() || 0; // Default to 0 if no value exists
            console.log("Initial humidifier state:", humidifiers);
        })
        .catch((error) => {
            console.error("Error fetching humidifier state:", error);
        });
}

function fantoggle() {
    console.log("done");

    if (fan === 0) {
        document.getElementById('popup-content').textContent = "Are you sure to turn on the Fan?";
    } else {
        document.getElementById('popup-content').textContent = "Are you sure to turn off the Fan?";
    }

    document.getElementById('popup').style.display = 'block';
    toggle = "fan";
}

function humidifier_toggle() {
    console.log("done");

    if (humidifiers === 0) {
        document.getElementById('popup-content').textContent = "Are you sure to turn on the Humidifier?";
    } else {
        document.getElementById('popup-content').textContent = "Are you sure to turn off the Humidifier?";
    }

    document.getElementById('popup').style.display = 'block';
    toggle = "humidifier";
}

function yes() {
    if (toggle === "fan") {
        if (fans === 0) {
            writeDeviceState('fan', 1);
            document.getElementById('fan').style.background = "-"
            fans = 1;
        } else {
            writeDeviceState('fan', 0);
            document.getElementById('fan').style.background = "linear-gradient(-315deg, #ff0000, #810606, #ff0000)";
            fans = 0;
        }
        document.getElementById('popup').style.display = 'none';
    } else if (toggle === "humidifier") {
        if (humidifiers === 0) {
            writeDeviceState('humidifier', 1);
            humidifiers = 1;
        } else {
            writeDeviceState('humidifier', 0);
            humidifiers = 0;
        }
        document.getElementById('popup').style.display = 'none';
    }
}

function no() {
    document.getElementById('popup').style.display = 'none';
}

function writeDeviceState(device, state) {
    // Write the state under the specified device node
    firebase.database().ref().update({
        [device]: state
    })
        .then(() => {
            console.log(device + ' state updated successfully');
        })
        .catch((error) => {
            console.error('Error writing to database:', error);
        });
}

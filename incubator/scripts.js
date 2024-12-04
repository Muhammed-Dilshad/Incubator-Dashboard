function updateMeter() {
    const needle1 = document.getElementById('s1');
    const needle2 = document.getElementById('s2');
    const fan = document.getElementById('fan');
    const humidifier = document.getElementById('humidifier');
    //assigning values
    humidity = 100;
    distance = 400;
    // Assuming temperature represents a percentage from 0 to 100
    const rotation1 = (humidity * 2.4) - 120;
    const rotation2 = ((distance / 4.0) * 2.4) - 120;
    //Display readings
    document.getElementById("meter1").textContent = `Humidity: ${humidity}%`;
    document.getElementById("meter2").textContent = `Distance: ${distance}m`;

    if (rotation1 > 120) {
        document.getElementById('popup-content').textContent = 'Humidity has exceeded the limit';
        document.getElementById('popup').style.display = 'flex';
        document.getElementById("meter1").style.background = `red`;
        document.getElementById("meter2").style.background = `-`;
        needle1.style.transform = `translate(-2px , -65px) rotate(120deg)`;
        needle2.style.transform = `translate(-2px , -65px) rotate(${rotation2}deg)`;
    }
    else if (rotation2 > 120) {
        document.getElementById('popup-content').textContent = 'Object is far away';
        document.getElementById('popup').style.display = 'flex';
        document.getElementById("meter2").style.background = `red`;
        document.getElementById("meter1").style.background = `-`;
        needle2.style.transform = `translate(-2px , -65px) rotate(120deg)`;
        needle1.style.transform = `translate(-2px , -65px) rotate(${rotation1}deg)`;
    } else {
        if (document.getElementById('popup').style.display == 'flex') {
            document.getElementById('popup').style.display = 'none';
        }
        // Rotate the needles
        document.getElementById("meter1").style.background = `-`;
        document.getElementById("meter2").style.background = `-`;
        needle1.style.transform = `translate(-2px , -65px) rotate(${rotation1}deg)`;
        needle2.style.transform = `translate(-2px , -65px) rotate(${rotation2}deg)`;
    }

    if (humidity <= 50) {
        fan.style.background = "red";
        document.getElementById('fan').textContent = 'OFF';
    }
    else {
        fan.style.background = "linear-gradient(-315deg,#1eff00 ,#148106, #1eff00)";
        document.getElementById('fan').textContent = 'ON';
    }
}
function refresh() {

    const needle1 = document.getElementById('s1');
    const needle2 = document.getElementById('s2');

    needle1.style.transform = `translate(-2px , -65px) rotate(120deg)`;
    needle2.style.transform = `translate(-2px , -65px) rotate(120deg)`;

    setTimeout(() => {
        updateMeter();
    }, 1000);
}

// Initialize the needle position
document.addEventListener('DOMContentLoaded', () => {
    refresh()
});

document.addEventListener('keydown',
    function (event) {
        if (event.key === 'f' || event.key === 'F') {
            togglefullscreen();
        }
    }
)

function togglefullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

var toggle = "";

function fantoggle() {
    console.log("done");
    document.getElementById('popup-content').textContent = "Are you sure to Turn on the Fan";
    document.getElementById('popup').style.display = 'block';
    toggle = "fan"
}

function humidifier_toggle() {
    console.log("done");
    document.getElementById('popup-content').textContent = "Are you sure to Turn on the Humidifier";
    document.getElementById('popup').style.display = 'block';
    toggle = "Humidifier"
}

function yes() {
    if (toggle === "fan") {
        console.log('fan');
        document.getElementById('popup').style.display = 'none';
    } else if (toggle === "Humidifier") {
        console.log('humidifier');
        document.getElementById('popup').style.display = 'none';
    }
}
// Show/hide forms
function showLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("dashboard").style.display = "none";
}

function showRegister() {
    document.getElementById("register-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("dashboard").style.display = "none";
}

// Register
function register() {
    const name = document.getElementById("register-name").value.trim();
    const ic = document.getElementById("register-ic").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const dob = document.getElementById("register-dob").value;
    const gender = document.getElementById("register-gender").value;
    const address = document.getElementById("register-address").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!name || !ic || !email || !phone || !dob || !gender || !address || !password) {
        alert("Please fill all fields");
        return;
    }

    // Demo medical info
    const medicalInfo = {
        bloodType: "O+",
        medicalRecordNumber: "MRN-" + Date.now(),
        allergies: "Penicillin",
        conditions: "Hypertension",
        medications: ["Amlodipine 5mg 08:00", "Vitamin D 1000IU 12:00", "Paracetamol 500mg 20:00"]
    };

    const userData = { name, ic, email, phone, dob, gender, address, password, ...medicalInfo };
    localStorage.setItem("userData", JSON.stringify(userData));
    alert(`Registered successfully!\nName: ${name}\nIC: ${ic}\nEmail: ${email}`);
    showLogin();
}

// Login
function login() {
    const ic = document.getElementById("login-ic").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!ic || !password) { alert("Please fill all fields"); return; }

    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser && storedUser.ic === ic && storedUser.password === password) {
        alert("Login successful!");
        showDashboard();
        startMedicineAlerts();
    } else alert("Invalid IC or password");
}

function publicSOS() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Demo: send data to hospital/police (replace with real API)
            alert(`SOS Sent!\nLocation: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}\nAuthorities alerted.`);

            // Here you can use fetch() to send POST request to your emergency API
            // fetch("YOUR_API_URL", { method: "POST", body: JSON.stringify({latitude, longitude}) })
        },
        (error) => {
            alert("Unable to retrieve your location. Please allow location access.");
        }
    );
}


// Dashboard
function showDashboard() {
    const dashboard = document.getElementById("dashboard");
    dashboard.style.display = "block";
    dashboard.innerHTML = `
        <h2>Dashboard</h2>
        <button class="big-btn" onclick="showProfile()">Profile</button>
        <button class="big-btn" onclick="showEmergency()">Emergency / SOS</button>
        <button class="big-btn" onclick="showMedicine()">Medicine Reminder</button>
        <button class="big-btn" onclick="showInsurance()">Medical Insurance</button>
        <button class="big-btn" onclick="showHealthTips()">Health Tips</button>
    `;
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "none";
}

// Profile
function showProfile() {
    const user = JSON.parse(localStorage.getItem("userData"));
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = `
        <h2>Profile</h2>
        <p><b>Name:</b> ${user.name}</p>
        <p><b>IC Number:</b> ${user.ic}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Phone:</b> ${user.phone}</p>
        <p><b>DOB:</b> ${user.dob}</p>
        <p><b>Gender:</b> ${user.gender}</p>
        <p><b>Address:</b> ${user.address}</p>
        <p><b>Blood Type:</b> ${user.bloodType}</p>
        <p><b>Medical Record #:</b> ${user.medicalRecordNumber}</p>
        <p><b>Allergies:</b> ${user.allergies}</p>
        <p><b>Conditions:</b> ${user.conditions}</p>
        <p><b>Medications:</b> ${user.medications.join(", ")}</p>
        <button class="big-btn" onclick="showDashboard()">Back</button>
    `;
}

// Emergency / SOS
function showEmergency() {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = `
        <h2>Emergency / SOS</h2>
        <input type="text" placeholder="Phone" id="em-phone"><br>
        <input type="email" placeholder="Email" id="em-email"><br>
        <textarea placeholder="Message" id="em-message" rows="4" style="width:90%"></textarea><br>
        <button class="big-btn" onclick="sendEmergency()">Send</button>
        <button class="big-btn" onclick="showDashboard()">Back</button>
    `;
}

function sendEmergency() {
    const phone = document.getElementById("em-phone").value.trim();
    const email = document.getElementById("em-email").value.trim();
    const message = document.getElementById("em-message").value.trim();
    if (!phone || !email || !message) { alert("Please fill all fields"); return; }
    alert(`Emergency message sent!\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`);
}

// Medicine Reminder
let medicineStatus = [];



function showMedicine() {
    const user = JSON.parse(localStorage.getItem("userData"));
    const dashboard = document.getElementById("dashboard");

    // Load saved medicine status from localStorage
    let savedStatus = JSON.parse(localStorage.getItem("medicineStatus")) || null;
    const now = Date.now();

    if (!savedStatus || now - savedStatus.timestamp > 24*60*60*1000) {
        // Reset for a new day
        medicineStatus = user.medications.map(med => ({ name: med, taken: false }));
        localStorage.setItem("medicineStatus", JSON.stringify({ timestamp: now, data: medicineStatus }));
    } else {
        medicineStatus = savedStatus.data;
    }

    let medHtml = `<h2>Medicine Reminder</h2>`;
    medicineStatus.forEach((med, i) => {
        medHtml += `<label><input type="checkbox" id="med-${i}" ${med.taken ? "checked" : ""} onchange="medicineTaken(${i})"> ${med.name}</label><br>`;
    });
    medHtml += `<button class="big-btn" onclick="showDashboard()">Back</button>`;
    dashboard.innerHTML = medHtml;
}

function medicineTaken(i) {
    medicineStatus[i].taken = document.getElementById(`med-${i}`).checked;
    // Save status to localStorage with timestamp
    localStorage.setItem("medicineStatus", JSON.stringify({ timestamp: Date.now(), data: medicineStatus }));
}


// Alerts for medicine times (test version: 10-second interval)
function startMedicineAlerts() {
    setInterval(() => {
        // Only check if medicineStatus exists
        if (!medicineStatus || medicineStatus.length === 0) return;

        medicineStatus.forEach((med, i) => {
            // If medicine not taken, show alert
            if (!med.taken) {
                alert(`Reminder: You have not taken your medicine: ${med.name}`);
            }
        });
    }, 10000); // every 10 seconds for testing
}


// Medical Insurance
function showInsurance() {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = `
        <h2>Medical Insurance</h2>
        <p><b>Provider:</b> Global Health Insurance</p>
        <p><b>Policy Number:</b> INS-${Math.floor(Math.random()*1000000)}</p>
        <p><b>Coverage:</b> Full medical, hospitalization, and prescription drugs</p>
        <p><b>Expiry:</b> 31-Dec-2025</p>
        <button class="big-btn" onclick="showDashboard()">Back</button>
    `;
}

// Health Tips
function showHealthTips() {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = `
        <h2>Health Tips</h2>
        <ul>
            <li>Drink at least 8 glasses of water daily.</li>
            <li>Take your prescribed medicine on time.</li>
            <li>Exercise at least 30 minutes a day.</li>
            <li>Eat more fruits and vegetables.</li>
            <li>Sleep at least 7-8 hours per night.</li>
        </ul>
        <button class="big-btn" onclick="showDashboard()">Back</button>
    `;
}


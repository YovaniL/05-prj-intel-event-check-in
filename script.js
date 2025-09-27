// Step one
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

// Track attendance
let count = 0;
const maxCount = 50;
let teamCounts = { water: 0, zero: 0, power: 0 };

// Load saved check-ins and counts from localStorage
let checkins = [];
if (localStorage.getItem("checkins")) {
  checkins = JSON.parse(localStorage.getItem("checkins"));
  count = checkins.length;
}
if (localStorage.getItem("teamCounts")) {
  teamCounts = JSON.parse(localStorage.getItem("teamCounts"));
}
if (localStorage.getItem("attendeeCount")) {
  count = parseInt(localStorage.getItem("attendeeCount"));
}

// Update UI on load
attendeeCount.textContent = count;
waterCount.textContent = teamCounts.water;
zeroCount.textContent = teamCounts.zero;
powerCount.textContent = teamCounts.power;
progressBar.style.width = Math.round((count / maxCount) * 100) + "%";

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  if (name !== "" && team !== "") {
    // Save check-in
    checkins.push({ name: name, team: team, teamName: teamName });
    localStorage.setItem("checkins", JSON.stringify(checkins));

    // Increment count
    count++;
    attendeeCount.textContent = count;
    localStorage.setItem("attendeeCount", count);

    // Update team counter
    if (teamCounts[team] !== undefined) {
      teamCounts[team]++;
      localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
      if (team === "water") {
        waterCount.textContent = teamCounts.water;
      } else if (team === "zero") {
        zeroCount.textContent = teamCounts.zero;
      } else if (team === "power") {
        powerCount.textContent = teamCounts.power;
      }
    }

    // Update progress bar
    const percent = Math.round((count / maxCount) * 100);
    progressBar.style.width = percent + "%";
    progressBar.textContent = percent + "%";

    // Show personalized greeting
    greeting.textContent = `Welcome, ${name} from ${teamName}!`;

    // Celebration feature
    if (count >= maxCount) {
      // Find winning team
      let maxTeam = "water";
      if (teamCounts.zero > teamCounts[maxTeam]) {
        maxTeam = "zero";
      }
      if (teamCounts.power > teamCounts[maxTeam]) {
        maxTeam = "power";
      }
      // Show celebration message
      greeting.textContent = `🎉 Attendance goal reached! Congratulations to ${
        maxTeam === "water"
          ? "Team Water Wise"
          : maxTeam === "zero"
          ? "Team Net Zero"
          : "Team Renewables"
      } for the most check-ins! 🎉`;
      // Highlight winning team
      document.getElementById(
        "waterCount"
      ).parentElement.style.backgroundColor =
        maxTeam === "water" ? "#ffe066" : "";
      document.getElementById("zeroCount").parentElement.style.backgroundColor =
        maxTeam === "zero" ? "#ffe066" : "";
      document.getElementById(
        "powerCount"
      ).parentElement.style.backgroundColor =
        maxTeam === "power" ? "#ffe066" : "";

      // Confetti effect
      launchConfetti();
    }

    // Confetti function
    function launchConfetti() {
      const confettiContainer = document.createElement("div");
      confettiContainer.style.position = "fixed";
      confettiContainer.style.left = 0;
      confettiContainer.style.top = 0;
      confettiContainer.style.width = "100vw";
      confettiContainer.style.height = "100vh";
      confettiContainer.style.pointerEvents = "none";
      confettiContainer.style.zIndex = 9999;
      document.body.appendChild(confettiContainer);

      for (let i = 0; i < 120; i++) {
        const confetti = document.createElement("div");
        confetti.style.position = "absolute";
        confetti.style.width = "10px";
        confetti.style.height = "18px";
        confetti.style.backgroundColor = randomColor();
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-30px";
        confetti.style.opacity = 0.8;
        confetti.style.borderRadius = "3px";
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confettiContainer.appendChild(confetti);

        // Animate confetti
        let fall = setInterval(function () {
          let top = parseFloat(confetti.style.top);
          if (top > window.innerHeight) {
            clearInterval(fall);
            confetti.remove();
          } else {
            confetti.style.top = top + 4 + Math.random() * 4 + "px";
            confetti.style.left =
              parseFloat(confetti.style.left) + Math.sin(top / 30) * 2 + "px";
          }
        }, 16);
      }
      // Remove confetti after 4 seconds
      setTimeout(function () {
        confettiContainer.remove();
      }, 4000);
    }
    function randomColor() {
      const colors = [
        "#ff595e",
        "#ffca3a",
        "#8ac926",
        "#1982c4",
        "#6a4c93",
        "#fff",
        "gold",
        "hotpink",
        "aqua",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    form.reset();
  }
});

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
    }

    form.reset();
  }
});

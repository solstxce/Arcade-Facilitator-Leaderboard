let leaderboardData = [];

function fetchData() {
  Papa.parse("info.csv", {
    download: true,
    header: true,
    complete: function(results) {
      leaderboardData = results.data;
      sortLeaderboard("skillBadges");
      updateLastUpdated();
    }
  });
}

function displayLeaderboard(information) {
  const leaderboardBody = document.querySelector("#leaderboard tbody");
  leaderboardBody.innerHTML = "";

  information.forEach((participant, index) => {
    const row = leaderboardBody.insertRow();
    row.insertCell(0).textContent = index + 1;
    row.insertCell(1).textContent = participant["User Name"];
    row.insertCell(2).textContent = participant["Milestone Earned"];
    row.insertCell(3).textContent = participant["# of Skill Badges Completed"];
    row.insertCell(4).textContent = participant["# of Arcade Games Completed"];
    row.insertCell(5).textContent = participant["# of Trivia Games Completed"];

    row.addEventListener("click", () => showModal(participant));
  });
}

function showModal(participant) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");

  modalTitle.textContent = participant["User Name"];
  modalContent.innerHTML = `
    <div class="modal-section">
      <h4>Skill Badges:</h4>
      <p>${participant["Names of Completed Skill Badges"]}</p>
    </div>
    <div class="modal-section">
      <h4>Arcade Games:</h4>
      <p>${participant["Names of Completed Arcade Games"]}</p>
    </div>
    <div class="modal-section">
      <h4>Trivia Games:</h4>
      <p>${participant["Names of Completed Trivia Games"]}</p>
    </div>
  `;

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

function updateLastUpdated() {
  const lastUpdated = document.getElementById("lastUpdated");
  const currentDate = new Date().toLocaleDateString();
  lastUpdated.textContent = `Last updated: ${currentDate}`;
}

function sortLeaderboard(sortBy) {
  leaderboardData = _.orderBy(leaderboardData, [
    participant => parseInt(participant[`# of ${sortBy === 'skillBadges' ? 'Skill Badges' : sortBy === 'arcadeGames' ? 'Arcade Games' : 'Trivia Games'} Completed`])
  ], ['desc']);
  
  displayLeaderboard(leaderboardData);
}

// Search functionality
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const searchQuery = searchInput.value.toLowerCase();
  
  const filteredData = leaderboardData.filter(participant => 
    participant["User Name"].toLowerCase().includes(searchQuery)
  );
  displayLeaderboard(filteredData);
});

// Scroll to top functionality
const myButton = document.getElementById("myBtn");

window.onscroll = function() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myButton.style.display = "block";
  } else {
    myButton.style.display = "none";
  }
};

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Sort functionality
document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const sortBy = th.dataset.sort;
    sortLeaderboard(sortBy);
  });
});

// Close modal when clicking on the close button or outside the modal
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target == modal || event.target.className == "close") {
    closeModal();
  }
}

// Call the fetchData function when the page loads
window.addEventListener("load", fetchData);
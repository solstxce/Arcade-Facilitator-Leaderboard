// Function to fetch CSV data from a file
function fetchData() {
    Papa.parse("info.csv", {
      download: true,
      header: true,
      complete: function(results) {
        var information = results.data;
        displayLeaderboard(information);
        updateLastUpdated();
      }
    });
  }
  
  function displayLeaderboard(information) {
    var leaderboardBody = document.querySelector("#leaderboard tbody");
    leaderboardBody.innerHTML = "";
  
    information.sort((a, b) => {
      return (
        -(
          parseInt(b["# of Skill Badges Completed"]) +
          parseInt(b["# of Arcade Games Completed"]) +
          parseInt(b["# of Trivia Games Completed"])
        ) +
        (
          parseInt(a["# of Skill Badges Completed"]) +
          parseInt(a["# of Arcade Games Completed"]) +
          parseInt(a["# of Trivia Games Completed"])
        )
      );
    });
  
    information.forEach((participant, index) => {
      var row = leaderboardBody.insertRow();
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
    var modal = document.getElementById("modal");
    var modalTitle = document.getElementById("modalTitle");
    var modalContent = document.getElementById("modalContent");
  
    modalTitle.textContent = participant["User Name"];
    modalContent.innerHTML = `
      <h4>Skill Badges:</h4>
      <p>${participant["Names of Completed Skill Badges"]}</p>
      <h4>Arcade Games:</h4>
      <p>${participant["Names of Completed Arcade Games"]}</p>
      <h4>Trivia Games:</h4>
      <p>${participant["Names of Completed Trivia Games"]}</p>
    `;
  
    modal.style.display = "block";
  }
  
  // Close modal when clicking on the close button or outside the modal
  window.onclick = function(event) {
    var modal = document.getElementById("modal");
    if (event.target == modal || event.target.className == "close") {
      modal.style.display = "none";
    }
  }
  
  function updateLastUpdated() {
    var lastUpdated = document.getElementById("lastUpdated");
    var currentDate = new Date().toLocaleDateString();
    lastUpdated.textContent = `Last updated: ${currentDate}`;
  }
  
  // Search functionality
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  
  searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const searchQuery = searchInput.value.toLowerCase();
    
    Papa.parse("info.csv", {
      download: true,
      header: true,
      complete: function(results) {
        const filteredData = results.data.filter(participant => 
          participant["User Name"].toLowerCase().includes(searchQuery)
        );
        displayLeaderboard(filteredData);
      }
    });
  });
  
  // Scroll to top functionality
  let mybutton = document.getElementById("myBtn");
  
  window.onscroll = function() {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
  
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  
  // Call the fetchData function when the page loads
  window.addEventListener("load", fetchData);
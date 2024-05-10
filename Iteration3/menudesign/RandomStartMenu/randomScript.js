import RandomMode from "../../scripts/model/randomMode.js";

document.addEventListener("DOMContentLoaded", function () {
  // Placeholder data
  const difficulties = ["Easy", "Medium", "Hard"];
  const imagePaths = ["../images/karta1.jpeg", "../images/FourLevels.jpg"];
  const jsonGraphPaths = ["../graphs/PreMadeOneLevel.json", "../graphs/FourLevelGraph.json"];

  const mapDropdown = document.getElementById("map-dropdown");
  const difficultyDropdown = document.getElementById("difficulty-dropdown");

  var canvases = document.querySelectorAll(".canvas");
  var selectedCourse = null;
  var jsonGraph = null;
  var images = [];

  // init the game for the chosen map, difficulty and number of controls.
  document.getElementById("play").addEventListener("click", function () {
    if (selectedCourse) {
      const selectedDifficulty = difficultyDropdown.value;
      const numberOfControls = document.getElementById("number-controls").value;

      let randomeMode = new RandomMode(
        selectedCourse,
        jsonGraph,
        selectedDifficulty,
        numberOfControls
      );
      randomeMode.initCourse();
    }
  });

  document.getElementById("quit").addEventListener("click", function () {
    window.location.href = "/index.html";
  });

  document.getElementById("instructions").addEventListener("click", function () {
    window.open("./Iteration3/menudesign/InstructionsManual/instructions.html", "_blank");
  });

  for (let i = 0; i < canvases.length; i++) {
    (function (index) {
      var ctx = canvases[i].getContext("2d");
      images[index] = new Image();
      images[index].src = imagePaths[index];

      images[index].onload = function () {
        canvases[index].width = images[index].width * 0.5;
        canvases[index].height = images[index].height * 0.5;
        ctx.drawImage(images[index], 0, 0);
        ctx.drawImage(
          images[index],
          0,
          0,
          canvases[index].width,
          canvases[index].height
        );
      };

      // For this to work properly, the images[] and jsonGraphPath[]
      // Need to be of the same length. I.e, one course must have
      // one and only one jsonGraph.
      canvases[index].addEventListener("click", function () {
        // Remove 'highlighted' class from all canvases
        canvases.forEach(function (canvas) {
          canvas.classList.remove("highlighted");
          selectedCourse = images[index];
          jsonGraph = jsonGraphPaths[index];
        });

        // Add 'highlighted' class to clicked canvas
        canvases[index].classList.add("highlighted");
      });
    })(i);
  }

  // Populate difficulty dropdown
  difficulties.forEach((difficulty) => {
    const option = document.createElement("option");
    option.value = difficulty;
    option.innerText = difficulty;
    difficultyDropdown.appendChild(option);
  });

  // Form submission handler
  document
    .getElementById("random-start-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting the traditional way

      const selectedMap = mapDropdown.value;
      const selectedDifficulty = difficultyDropdown.value;
      const numberOfControls = document.getElementById("number-controls").value;

      console.log(
        `Map: ${selectedMap}, Difficulty: ${selectedDifficulty}, Number of Controls: ${numberOfControls}`
      );
      // You can add your logic to handle the chosen options here.
    });
});

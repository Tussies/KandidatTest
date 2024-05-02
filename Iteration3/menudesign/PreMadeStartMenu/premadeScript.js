import GameMode from "../../scripts/model/gameMode.js";

document.addEventListener("DOMContentLoaded", function () {
  // Placeholder for adding courses dynamically, you would fetch this data or retrieve it from an array.
  var selectedCourse = null;
  var jsonGraph = null;
  const imagePaths = ["../images/karta1.jpeg", "../images/FourLevels.jpg"];
  const jsonGraphPaths = ["../graphs/3.json", "../graphs/FourLevelsGraph.json"];

  document.getElementById("play").addEventListener("click", function () {
    if (selectedCourse) {
      let gameMode = new GameMode(selectedCourse, jsonGraph);
      gameMode.initcourse();
    }
  });

  document.getElementById("quit").addEventListener("click", function () {
    window.location.href = "../StartMenu/index.html";
  });

  var canvases = document.querySelectorAll(".canvas");

  var image1, image2;
  var images = [image1, image2];

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
});

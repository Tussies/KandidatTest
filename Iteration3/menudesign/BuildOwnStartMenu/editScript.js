import EditMode from "../../scripts/model/editMode.js";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("edit").addEventListener("click", function () {
    let editMode = new EditMode(selectedCourse);
  });

  document.getElementById("quit").addEventListener("click", function () {
    window.location.href = "../StartMenu/index.html";
  });

  var selectedCourse = null;
  const imagePaths = ["./images/karta1.jpeg", "./images/FourLevels.jpg"];

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
        });

        // Add 'highlighted' class to clicked canvas
        canvases[index].classList.add("highlighted");
      });
    })(i);
  }
});

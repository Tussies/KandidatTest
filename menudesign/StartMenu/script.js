document
  .getElementById("premade-course")
  .addEventListener("click", function () {
    window.location.href = "../PreMadeStartMenu/premade.html";
    // Add functionality for playing a pre-made course here
  });

document.getElementById("random-course").addEventListener("click", function () {
  window.location.href = "../RandomStartMenu/random.html";
  // Add functionality for playing a random course here
});

document.getElementById("build-course").addEventListener("click", function () {
  window.location.href = "../BuildOwnStartMenu/edit.html";
  // Add functionality for building your own course here
});

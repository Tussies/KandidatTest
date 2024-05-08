document
  .getElementById("premade-course")
  .addEventListener("click", function () {
    window.location.href =
      "./Iteration3/menudesign/PreMadeStartMenu/premade.html";
    // Add functionality for playing a pre-made course here
  });

document.getElementById("random-course").addEventListener("click", function () {
  window.location.href = "./Iteration3/menudesign/RandomStartMenu/random.html";
  // Add functionality for playing a random course here
});

document.getElementById("build-course").addEventListener("click", function () {
  window.location.href = "./Iteration3/menudesign/BuildOwnStartMenu/edit.html";
  // Add functionality for building your own course here
});

document.getElementById("instructions").addEventListener("click", function () {
  window.open("/iteration3/menudesign/InstructionsManual/instructions.html", "_blank");
});

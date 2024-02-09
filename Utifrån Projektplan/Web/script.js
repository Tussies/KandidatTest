document.addEventListener('DOMContentLoaded', function() {
    const nodes = document.querySelectorAll('.node');
  
    nodes.forEach(node => {
      node.addEventListener('click', function() {
        // You can customize this function to define what happens when a node is clicked
        console.log(`Clicked node: ${node.id}`);
      });
    });
  });
  

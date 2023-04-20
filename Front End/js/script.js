// Array of texts to show
var texts = ["Welcome to Bingo Game", "Play and Win Big", "Have Fun with Friends"];
  
// Counter for current text index
var currentTextIndex = 0;

// DOM element to show the text
var typingEffect = document.getElementById("typing-effect");

// Function to perform the typing effect
function type() {
  // Get the current text
  var currentText = texts[currentTextIndex];
  
  // Show each character one by one
  for (var i = 0; i < currentText.length; i++) {
    (function(i) {
      setTimeout(function() {
        typingEffect.innerHTML += currentText.charAt(i);
      }, i * 100);
    })(i);
  }
  
  // Wait for a moment and then erase the text
  setTimeout(function() {
    for (var i = currentText.length; i >= 0; i--) {
      (function(i) {
        setTimeout(function() {
          typingEffect.innerHTML = currentText.substring(0, i);
        }, (currentText.length - i) * 50);
      })(i);
    }
    
    // Increase the current text index and repeat
    currentTextIndex++;
    if (currentTextIndex >= texts.length) {
      currentTextIndex = 0;
    }
    
    setTimeout(type, currentText.length * 50 + 1000);
  }, currentText.length * 100 + 1000);
}

// Start the typing effect
type();
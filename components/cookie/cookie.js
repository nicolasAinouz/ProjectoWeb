 const overlay = document.getElementById("cookie-overlay");
 const acceptButton = document.getElementById("accept-cookies");
 const cookieContainer = document.getElementById('cookie-container'); 

 acceptButton.addEventListener("click", function () {
   localStorage.setItem("cookiesAccepted", "true");
   cookieContainer.style.display = "none"; 
   console.log("toto")
 });

 
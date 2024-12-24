

let currentIndex = 0; 
let totalSlides=3;
document.getElementById("next").addEventListener("click", function() {
    let slides = document.getElementById("slides");

    slides.style.animation = "none"; 

    if(currentIndex <2){
        currentIndex++;
    }
    else{
        currentIndex=2;
    }

    const position = -currentIndex * 50;
    slides.style.transform = `translateX(${position}%)`;;
});

document.getElementById("prev").addEventListener("click", function () {
    let slides = document.getElementById("slides");

    slides.style.animation = "none"; 

    if (currentIndex > 0) { 
        currentIndex--; 
    } else {
        currentIndex = 0;
    }

    const position = -currentIndex * 50; 
    slides.style.transform = `translateX(${position}%)`;
});

function autoSlide() {
    setInterval(() => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
          
        } else {
            currentIndex = 0; // Revenir au début si on est au dernier slide
          
        }
       
    }, 4000);
}

autoSlide();

  
  




  function filterProducts() {
    const searchTerm = document.getElementById('search_box').value.toLowerCase();
    const products = document.querySelectorAll('.s');
    products.forEach(product => {
        const productName = product.textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}


document.getElementById('profile').onclick = function() {
    var menu = document.getElementById('menu');
    var button = document.getElementById('profile');
    var rect = button.getBoundingClientRect(); 

    
    menu.style.top = rect.bottom + window.scrollY + "px"; 
    menu.style.left = (rect.left -150) + "px"; 
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  }

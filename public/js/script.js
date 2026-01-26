// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const goToTopBtn=document.getElementById("scrollToTopBtn");

window.onscroll=()=>{
  scrollFunction();
};

scrollFunction=()=>{
  if(
    document.body.scrollTop>300 || document.documentElement.scrollTop>300
  )
  {
    goToTopBtn.style.display="block"; 
  }
  else{
    goToTopBtn.style.display="none"; 
  }
}

goToTopBtn.onclick=()=>{
  goToTopBtn.style.display="none";
  window.scroll({
   top: 0,
   behavior:"smooth",
  });
};

const slides = document.querySelectorAll(".hero-slide");

if (slides.length === 2) {
  const images = [
    "/images/img1.jpeg",
    "/images/img2.jpeg",
    "/images/img3.jpeg",
    "/images/img4.jpeg",
    "/images/img5.jpeg",
    "/images/img6.jpeg",
    "/images/img7.jpeg"
  ];

  let imageIndex = 0;
  let activeSlide = 0;

  // preload first two images
  slides[0].style.backgroundImage = `url(${images[0]})`;
  slides[1].style.backgroundImage = `url(${images[1]})`;
  slides[0].classList.add("active");

  imageIndex = 1;

  setInterval(() => {
    const nextSlide = (activeSlide + 1) % 2;
    imageIndex = (imageIndex + 1) % images.length;

    // prepare next slide BEFORE animation
    slides[nextSlide].style.backgroundImage =
      `url(${images[imageIndex]})`;

    // animate
    slides[activeSlide].classList.add("exit");
    slides[nextSlide].classList.add("active");

    // cleanup AFTER animation
    setTimeout(() => {
      slides[activeSlide].classList.remove("active", "exit");
      activeSlide = nextSlide;
    }, 1000); // must match CSS transition
  }, 5000);
}

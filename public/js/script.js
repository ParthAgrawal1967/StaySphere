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
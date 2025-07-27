document.addEventListener("DOMContentLoaded", function () {
    const userType = document.getElementById("userType");
    if (userType) {
        userType.addEventListener("change", function () {
            const selectedUrl = this.value;
            if (selectedUrl) {
                window.location.href = selectedUrl;
            }
        });
    }
});


 document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");

    if (toggleBtn && passwordField) {
        toggleBtn.addEventListener("click", function () {
            const icon = this.querySelector("i");

            if (passwordField.type === "password") {
                passwordField.type = "text";
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            } else {
                passwordField.type = "password";
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            }
        });
    }
});



$(document).ready(function(){
    $('.slider').slick({
      autoplay: true,
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    });
  });
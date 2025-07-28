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


 document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");

  if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
      const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);
      togglePassword.innerHTML =
        type === "password"
          ? '<i class="bi bi-eye"></i>'
          : '<i class="bi bi-eye-slash"></i>';
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
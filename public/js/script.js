(() => {
  "use strict";

  // Wait for the DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false,
      );
    });

    let msg = document.querySelector(".message");

    if (msg) {
      setTimeout(() => {
        msg.style.top = "0px";
        setTimeout(() => {
          msg.style.display = "none";
        }, 2000);
      }, 2000);
    }
    const fileInput = document.getElementById("fileInput");
    const previewImage = document.getElementById("previewImage");

    if (fileInput && previewImage) {
      fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
          const objectURL = URL.createObjectURL(file);
          console.log(objectURL);
          previewImage.src = objectURL;
          previewImage.onload = () => URL.revokeObjectURL(objectURL);
        }
      });
    }
  });
})();

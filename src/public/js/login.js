const form = document.querySelector("#loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    result.json().then((json) => {
      if (json.status === "success") {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          text: `Login success!`,
          icon: "success",
          willClose: () => {
            window.location.replace("/products");
          },
        });
      }
      if (json.status === "error") {
        Swal.fire({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          title: `Error`,
          text: `${json?.message}`,
          icon: "error",
        });
      }
    });
  });
});

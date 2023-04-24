const socket = io();
const container = document.querySelector("#tbody-products");

socket.on("realTimeProducts", (data) => {
  let products = "";
  data.forEach((p) => {
    products += `
    <tr>
      <td>${p._id}</td>
      <td>${p.title}</td>
      <td>${p.description}</td>
      <td>${p.code}</td>
      <td>${p.price}</td>
      <td>${p.status}</td>
      <td>${p.category}</td>
  </tr>`;
  });
  container.innerHTML = products;
});

const addProduct = document.querySelector("#addProduct");
const formAddProduct = document.querySelector("#formAddProduct");

addProduct.addEventListener("click", async (e) => {
  e.preventDefault();
  const product = {
    title: formAddProduct.title.value,
    description: formAddProduct.description.value,
    code: formAddProduct.code.value,
    price: formAddProduct.price.value,
    stock: formAddProduct.stock.value,
    category: formAddProduct.category.value,
  };
  const response = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const json = await response.json();
  if (json.status === "success") {
    formAddProduct.reset();
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Producto agregado`,
      icon: "success",
    });
  }
  if (json.status === "error") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `${json.message}`,
      icon: "error",
    });
  }
});

const deleteProduct = document.querySelector("#deleteProduct");
const formDeleteProduct = document.querySelector("#formDeleteProduct");

deleteProduct.addEventListener("click", async (e) => {
  e.preventDefault();
  const id = formDeleteProduct.productId.value;
  if (!id)
    return Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Complete el campo ID`,
      icon: "error",
    });

  const response = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (json.status === "success") {
    formDeleteProduct.reset();
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Producto borrado`,
      icon: "success",
    });
  }
  if (json.status === "error") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `${json.message}`,
      icon: "error",
    });
  }
});

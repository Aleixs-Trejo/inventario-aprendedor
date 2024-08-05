document.addEventListener("DOMContentLoaded", () => {
  const $userSpan = document.querySelector(".user__info");
  const $clientSpan = document.querySelector(".client__info");
  const $usuarioVentaSelect = document.getElementById("usuario_venta");
  const $clienteVentaSelect = document.getElementById("cliente_venta");
  const $productoVentaSelect = document.getElementById("producto_venta");
  const $totalSale = document.querySelector(".total");
  const $viewSales = document.querySelector(".view__sale");
  const $venderBtn = document.querySelector(".btn__vender");
  const $modal = document.querySelector(".modal__sale");

  // Verificar si se ha seleccionado un cliente del select
  const checkClientSelection = () => {
    const clientSelected = $clienteVentaSelect.value !== "selecciona";
    return clientSelected;
  }

  // Togglear botón de vender
  const toggleBtns = () => {
    if (checkClientSelection()) {
      $venderBtn.disabled = false;
    } else {
      $venderBtn.disabled = true;
    }
  };

  // verificar productos en carrito
  const checkCartProducts = () => {
    const productsInCart = $viewSales.querySelectorAll(".view__sale--data");
    return productsInCart.length > 0;
  }

  // Mostrar el nombre del Cliente seleccionado
  const updateClientData = () => {
    const clientSelect = $clienteVentaSelect.options[$clienteVentaSelect.selectedIndex].text;

    // Actualizar datos
    $clientSpan.textContent = clientSelect;
    console.log("Cliente seleccionado: ", $clientSpan);
  };

  // Toggle de btn de vender
  $clienteVentaSelect.addEventListener("change", () => {
    updateClientData();
    toggleBtns();
  });
  toggleBtns();

  // Actualizar el total de la venta
  const updateTotalSale = () => {
    try {
      let total = 0;
      const productsInCart = $viewSales.querySelectorAll(".view__sale--data");
      productsInCart.forEach(product => {
        const priceProduct = parseFloat(product.querySelector(".precio__total"));
        if (priceProduct) {
          total += priceProduct.textContent.substring(2);;
        }
      });
      $totalSale.textContent = `S/${total}`;
    } catch (error) {
      console.log("Error al calcular el total de la venta: ", error.message);
    }
  };

  // Agregar productos al carrito
  const addProductToCart = (productoVenta) => {
    // Verificar si hay productos en el carrito
    const existingProduct = $viewSales.querySelector(`[data-product-id="${productoVenta._id}"]`);

    if (existingProduct) {
      // Incrementar la cantidad del producto
      const quantityProduct = existingProduct.querySelector(".cantidad__producto");
      let quantity = parseInt(quantityProduct.textContent);
      const selectedProduct = $productoVentaSelect.options[$productoVentaSelect.selectedIndex].text;
      const stock = parseInt(selectedProduct.dataset.stock);

      // Verificar si hay stock disponible
      if (quantity < stock) {
        quantityProduct.textContent = quantity + 1;
        const totalPriceProduct = existingProduct.querySelector(".precio__total");
        const totalPriceSale = parseFloat(totalPriceProduct.textContent.substring(2)) + parseFloat(productoVenta.precioProducto);
        totalPriceProduct.textContent = `S/${totalPriceSale.toFixed(2)}`;
      } else {
        alert("No hay stock disponible para este producto.");
        $productoVentaSelect.value = "selecciona";
      }
    } else {
      const vista = `
        <article class="view__sale--data view__grid" data-product-id="${productoVenta._id}">
        <div class="flex-c-c">${productoVenta.codigoProducto}</div>
        <div class="flex-c-c">${productoVenta.nombreProducto}</div>
        <div class="flex-c-c">${productoVenta.descripcionProducto}</div>
        <div class="flex-c-c cantidad__producto">1</div>
        <div class="flex-c-c precio__unitario">S/${productoVenta.precioProducto}</div>
        <div class="flex-c-c">S/0.00</div>
        <div class="flex-c-c precio__total">S/${productoVenta.precioProducto}</div>
        <div class="flex-c-c items__data--options">
          <button class="options__action">
            <figure class="options__figure">
              <img src="../assets/icon-delete.svg" alt="Icon Delete" class="options__img remove__product">
            </figure>
          </button>
        </div>
      </article>
      `;
      $viewSales.insertAdjacentHTML("beforeend", vista);
    }
    updateTotalSale();
    $productoVentaSelect.value = "selecciona";
  };

  // Validar datos de stock
  $productoVentaSelect.addEventListener("change", () => {
    const selectedProduct = $productoVentaSelect.options[$productoVentaSelect.selectedIndex].text;
    console.log("Producto seleccionado: ", selectedProduct, selectedProduct.dataset);
    const productId = selectedProduct.value;
    const productCod = selectedProduct.dataset.cod;
    const productNombre = selectedProduct.dataset.nombre;
    const productDescripcion = selectedProduct.dataset.descripcion;
    const productStock = parseInt(selectedProduct.dataset.stock);
    const productPrecio = parseFloat(selectedProduct.dataset.precio);

    // Verificar Stock
    if (productStock > 0) {
      // Crear objeto del producto
      const productoVenta = {
        _id: productId,
        codigoProducto: productCod,
        nombreProducto: productNombre,
        descripcionProducto: productDescripcion,
        precioProducto: productPrecio.toFixed(2)
      };
      addProductToCart(productoVenta);
    } else {
      alert("No hay stock disponible para este producto.");
      $productoVentaSelect.value = "selecciona";
    }
  });

  // Quitar productos del carrito
  const removeToCart = (productId) => {
    const productToRemove = $viewSales.querySelector(`[data-product-id="${productId}"]`);
    if (productToRemove) {
      const quantityProduct = productToRemove.querySelector(".cantidad__producto");
      let quantity = parseInt(quantityProduct.textContent);

      if (quantity > 1) {
        console.log("Reduciendo cantidad...");
        quantity--;
        quantityProduct.textContent = quantity;

        // Actualizar el precio total del producto
        const priceProduct = parseFloat(productToRemove.querySelector(".precio__total").textContent.substring(2));
        const unitPriceProduct = parseFloat(productToRemove.querySelector(".precio__unitario").textContent.substring(2));
        const totalPrice = quantity * unitPriceProduct;
        priceProduct.textContent = `S/${totalPrice.toFixed(2)}`;
        console.log("Precio total actualizado: ", totalPrice);
      } else {
        // Eliminar producto si la cantidad es 0
        console.log("Eliminando producto...");
        productToRemove.remove();
      }
      updateTotalSale();
    }
  };

  $viewSales.addEventListener("click", e => {
    console.log("Click en el carrito: ", e.target);
    if (e.target.classList.contains("remove__product")) {
      const productId = e.target.closest(".view__sale--data").dataset.productId;
      console.log("Click en el botón de eliminar")
      removeToCart(productId);
    }
  });

  // Modal de Vender
  $venderBtn.addEventListener("click", () => $modal.classList.add("modal__show"));

  // Boton de seguir comprando
  const $seguirComprandoBtn = document.querySelector(".modal__btn--comprar");

  $seguirComprandoBtn.addEventListener("click", () => $modal.classList.remove("modal__show"));

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    const usuarioVenta = $userSpan.dataset.user;
    const clienteVenta = $clienteVentaSelect.value;
    const productosVenta = [];

    // Obtener productos del carrito
    const productsInCart = $viewSales.querySelectorAll(".view__sale--data");

    // Número de productos en carrito
    const tipoProductosVenta = productsInCart.length;

    // Iterar sobre cada producto
    productsInCart.forEach(product => {
      const idProducto = product.getAttribute("data-product-id");
      const cantidadProducto = parseInt(product.querySelector(".cantidad__producto").textContent);
      const precioUnitario = parseFloat(product.querySelector(".precio__unitario").textContent.substring(2));

      // Guardar los datos en el objeto productoVenta
      const productoVenta = {
        idProducto,
        cantidadProducto,
        precioUnitario
      };

      // Agregar al array
      productosVenta.push(productoVenta);
    });

    // Crear un objeto con los detalles de la venta
    const detallesVenta = {
      usuarioVenta,
      clienteVenta,
      tipoProductosVenta,
      productosVenta
    };

    console.log("Detalles de la venta: ", detallesVenta);
    console.log("Productos de la venta recibidos: ", productosVenta);

    // Enviar los datos al servidor
    try {
      const response = await fetch("/sales/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(detallesVenta)
      });
      if (response.ok) {
        console.log("Venta registrada exitosamente.");
        // Quitar el modal
        $modal.classList.remove("modal__show");
        // Redirigir la vista a /sales
        window.location.href = "/sales";
      } else {
        console.log("Error al registrar la venta.");
      }
    } catch (error) {
      console.log("Error en el POST: ", error.message);
    }
  };

  // Agregar evento al envío del formulario
  const $venderForm = document.getElementById("form_vender");
  $venderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleSubmit();
  });

  // Cerrar modal
  window.addEventListener("click", (event) => {
    if (event.target === $modal) {
      $modal.classList.remove("modal__show");
    }
  });
  // Cerrar modal
  window.addEventListener("click", (event) => {
    if (event.target === $modal) {
      $modal.classList.remove("modal__show");
    }
  });
});
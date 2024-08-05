document.addEventListener("DOMContentLoaded", () => {
  const selectSearch = document.getElementById("select-search");
  const searchElement = document.getElementById("search-element");
  const selectOrder = document.getElementById("select-order");
  const itemsDataValues = document.querySelector(".items__data--values");
  const productData = document.querySelectorAll(".product__data");
  // const selectedFilter = selectSearch.value;
  // const searchQuery = searchElement.value.toLowerCase();
  // const selectedOrder = selectOrder.value;

  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams;
  };

  function filterAndSortItems(selectedFilter, searchQuery, selectedOrder) {
    // Filtrar y ordenar los elementos de la lista 
    productData.forEach(item => {
      const childElement = item.querySelector(`[data-${filter}]`);
      console.log("Elemento filtrado: ", childElement);
      if (!childElement || !childElement.textContent.toLowerCase().includes(searchQuery)) {
        item.style.display = "none";
      } else {
        item.style.display = "grid";
      }
    });

    // Ordenar los elementos de la lista
    const sortedItems = Array.from(productData)
      .sort((a, b) => {
        // Función para verificar si un valor es numérico
        function isNumeric(value) {
          return /^\d+$/.test(value);
        };

        console.log("Valor de a:", a);
        console.log("Valor de b:", b);

        const aValueElement = a.querySelector(`[data-${selectedFilter}]`);
        const bValueElement = b.querySelector(`[data-${selectedFilter}]`);
        console.log("Valor de aValueElement:", aValueElement);
        console.log("Valor de bValueElement:", bValueElement);

        const aValue = aValueElement.getAttribute(`data-${selectedFilter}`);
        const bValue = bValueElement.getAttribute(`data-${selectedFilter}`);
        console.log("Valor de aValue:", aValue);
        console.log("Valor de bValue:", bValue);

        const aNumericValue = isNumeric(aValue) ? parseFloat(aValue) : null;
        const bNumericValue = isNumeric(bValue) ? parseFloat(bValue) : null;

        if(aNumericValue !== null && bNumericValue !== null) {
          return selectedOrder === "asc" ? aNumericValue - bNumericValue : bNumericValue - aNumericValue;
        } else if (aNumericValue !== null) {
          return -1;
        } else if (bNumericValue !== null) {
          return 1;
        } else {
          return selectedOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

      });

    if (sortedItems.length > 0) {
      console.log("Elementos ordenados: ", sortedItems);
      itemsDataValues.innerHTML = "";
      sortedItems.forEach(item => itemsDataValues.appendChild(item));
    } else {
      console.log("No se encontraron productos: ", sortedItems);
    }

    // Actualizar los parámetros de la URL después de filtrar y ordenar
    const urlParams = getUrlParams();
    urlParams.set("f", selectedFilter);
    urlParams.set("q", searchQuery);
    urlParams.set("o", selectedOrder);
    console.log("URLParams: ", urlParams);
    window.history.replaceState({}, "", `${location.pathname}?${urlParams}`);
  }

  // Llamar a la función filtrar al cargar la vista
  const initialSearchQuery = searchElement.value.toLowerCase();
  filterAndSortItems(selectSearch.value, initialSearchQuery, selectOrder.value);

  // Select de busqueda y ordenamiento
  selectSearch.addEventListener("change", () => {
    const selectedFilter = selectSearch.value;
    const searchQuery = searchElement.value.toLowerCase();
    const selectedOrder = selectOrder.value;
    console.log("Filtrando por: ", selectedFilter);
    // const urlParams = getUrlParams();
    // urlParams.set("f", selectedFilter);
    // window.history.replaceState({}, "", `${location.pathname}?${urlParams}`);

    filterAndSortItems(selectedFilter, searchQuery, selectedOrder);
  })

  // Input search
  searchElement.addEventListener("input", () => {
    const selectedFilter = selectSearch.value;
    const searchQuery = searchElement.value.toLowerCase();
    const selectedOrder = selectOrder.value;
    console.log("Buscar: ", searchQuery);
    // const urlParams = getUrlParams();
    // urlParams.set("q", searchQuery);
    // window.history.replaceState({}, "", `${location.pathname}?${urlParams}`);

    filterAndSortItems(selectedFilter, searchQuery, selectedOrder);
  });

  selectOrder.addEventListener("change", () => {
    const selectedFilter = selectSearch.value;
    const searchQuery = searchElement.value.toLowerCase();
    const selectedOrder = selectOrder.value;
    console.log("Ordenando por: ", selectedOrder);
    // const urlParams = getUrlParams();
    // urlParams.set("o", selectedOrder);
    // window.history.replaceState({}, "", `${location.pathname}?${urlParams}`);

    filterAndSortItems(selectedFilter, searchQuery, selectedOrder);
  })

});
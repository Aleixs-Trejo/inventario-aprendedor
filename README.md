# Sistema de Ventas y Hotelería

## Introducción

Sistema diseñado para la **gestión y administración de negocios de ventas y de hotelería**. Permite realizar CRUD completo para diversas entidades y gestionar operaciones comerciales y de hospedaje.

## Instalación y Configuración Inicial

### Requisitos Previos
- Node.js
- MongoDB
- Express

### Instalación del Sistema
1. Clona el repositorio del proyecto.
   ```bash
   git clone https://github.com/Aleixs-Trejo/inventario-aprendedor.git
   ```

2. Navega al directorio del proyecto.
   ```bash
   cd inventario
   ```

3. Instala las dependencias ejecutando:
   ```bash
   npm install
   ```

### Configuración inicial

1. Configura las variables de entorno en el archivo `.env`.
2. Ejecuta el servidor con:
   ```bash
   npm start
   ```

## Guía del usuario
### Diseño de la BD
![db-connection](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/db-connect-inventario.png)
### 1. Creación de Roles de trabajadores

  - 1. Navega a la ruta `/users-rol`.

  - 2. Haz click en "Nuevo Rol" (+).

  ![users-roles](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-roles.png)

  - 3. Completa los campos: "Nombre" y "Descripción".

  ![new-role](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-role.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-role](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-role.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-role](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-role.png)


### 2. Registro de Trabajadores

  - 1. Navega a la ruta `/employees`.

  - 2. Haz click en "Nuevo Trabajador" (+).

  ![employees](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-employes.png)

  - 3. Completa los campos: "Rol", "Nombre", "Apellidos", "Correo", "Celular", estado (Activo/Inactivo).

  ![new-employee](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-employee.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-employee](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-employee.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-employee](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-employee.png)

  - 7. Para ver el historial, haz click en "Historial"

  ![history-employee](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-employees.png)

  - 8. Para exportar, haz click en "Exportar"

  ![export-employee](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/export-employees.png)


### 3. Registro de Proveedores

  - 1. Navega a la ruta `/providers`.

  - 2. Haz click en "Nuevo Proveedor" (+).

  ![providers](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-providers.png)

  - 3. Completa los campos: "Documento / RUC", "Nombre", "Celular", "Correo", "Dirección".

  ![new-provider](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-provider.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-provider](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-provider.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-provider](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-provider.png)

  - 7. Para ver el historial, haz click en "Historial"

  ![history-provider](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-provider.png)

  -8 Para exportar, haz click en "Exportar"

  ![export-provider](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/export-provider.png)


### 4. Registro de Categorias de Productos

  - 1. Navega a la ruta `/categories`.

  - 2. Haz click en "Nueva Categoría" (+).

  ![categories-products](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-categories.png)

  - 3. Completa los campos: "Nombre", "Descripción".

  ![new-category](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-category.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-category](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-category.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-category](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-category.png)

  - 7. Para ver el historial, haz click en "Historial"

  ![history-category](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-categories.png)


### 5. Registro de Productos

  - 1. Navega a la ruta `/products`.

  - 2. Haz click en "Nuevo Producto" (+).

  ![products](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-products.png)

  - 3. Completa los campos: "Proveedor", "Categoria", "Código", "Nombre", "Descripción", "Precio".

  ![new-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-product.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-product.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-product.png)

  - 7. Para ver el historial, haz click en "Historial"

  ![history-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-products.png)

  - 8. Para exportar, haz click en "Exportar"

  ![export-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/export-products.png)


### 6. Registro de Sucursales de almacén

  - 1. Navega a la ruta `/stock-locations`.

  - 2. Haz click en "Nueva Ubicación" (+).

  ![stock-locations](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-locations.png)

  - 3. Completa los campos: "Ubicación", "Descripción".

  ![new-location](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-location.png)

  - 4. Haz click en "Crear Ubicación".

  - 5. Para editar, haz click en "Editar"

  ![edit-location](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-location.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-location](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-location.png)


### 7. Ingreso de Productos a almacén

  - 1. Navega a la ruta `/stores`.

  - 2. Haz click en "Agregar Producto" (+).

  ![stores](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-stores.png)

  - 3. En la barra de búsqueda busca los productos que desees agregar al almacén.

  ![add-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-store-1.png)

  - 4. Elige la ubicación (Sucursal), el stock entrante y el stock mínimo para crear una alerta.

  ![add-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-store-2.png)

  ![add-product](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-store-3.png)

  - 5. Haz click en "Guardar".

  - 6. Para editar, haz click en "Editar"

  ![edit-store](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-store.png)

  - 7. Para eliminar, haz click en "Eliminar"

  ![delete-store](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-store.png)

  - 8. Para ver el historial, haz click en "Historial"

  ![history-store](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-stores.png)

  - 9. Para exportar, haz click en "Exportar"

  ![export-store](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/export-stores.png)


### 8. Registro de Clientes

  - 1. Navega a la ruta `/clients`.

  - 2. Haz click en "Nuevo Cliente" (+).

  ![clients](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-clients.png)

  - 3. Completa los campos: "DNI/RUC", "Nombres Completos", "Correo", "Celular".

  ![new-client](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-client.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-client](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-client.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-client](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-client.png)

  - 7. Para ver el historial, haz click en "Historial"

  ![history-client](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-clients.png)


### 9. Proceso de Venta

  - 1. Navega a la ruta `/sales`.

  ![sales](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-sales.png)

  - 2. Haz click en "Nueva Venta" (+).

  - 3. Completa el campo de "Documento", si el cliente no se quiere registrar, solo déjalo tal cual con el documento de Clientes Varios (00000000).

  ![new-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-sale-1.png)

  - 4. En la barra de búsqueda busca los productos del almacén que desees agregar al carrito.

  ![new-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-sale-2.png)

  - 5. Añade la cantidad de productos, y aplica descuento si es necesario.

  ![new-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-sale-3.png)

  - 6. Haz click en "Vender".

  - 7. Para ver los detalles de la venta, haz click en "Detalles"

  ![details-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-sale.png)

  - 8. Puedes cancelar la venta al clickar en "Cancelar Venta"

  - 9. Puedes ver el comprobante de la venta en formato ticket o A4

  ![ticket-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/ticket-sale.png)

  ![boleta-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/boleta-sale.png)


### 10. Cierre de caja y Gestión de Ventas

  - 1. Navega a la ruta `/sales`.

  - 2. Haz click en "Exportar Excel".

  ![export-sales](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/export-sales.png)

  - 3. Haz click en "Cerrar Caja".

  - 4. Puedes ver el historial de ventas

  ![history-sales](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-sales.png)

  - 5. Puedes ver los balances al cerrar la caja

  ![balance-sales](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/balance-sales.png)



## Gestión de Hotelería

![hotel-index](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/hotel-index.png)

### 1 Pisos:

  - 1. Navega a la ruta `/floors`.

  - 2. Haz click en "Nuevo Piso" (+).

  ![floors](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-floors.png)

  - 3. Completa los campos: "Número" y "Descripción".

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  - 6. Para eliminar, haz click en "Eliminar"


### 2 Categorias de Habitación:

  - 1. Navega a la ruta `/categories-room`.

  - 2. Haz click en "Nueva Categoría" (+).

  ![categories-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-categories-room.png)

  - 3. Completa los campos: "Nombre", "Descripción".

  ![new-category-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-category-room.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-category-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-category-room.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-category-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-category-room.png)


### 3 Estados de Habitación:

  - 1. Navega a la ruta `/status-room`.

  - 2. Haz click en "Nuevo Estado" (+).

  ![states-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-states-room.png)

  - 3. Completa los campos: "Nombre", "Descripción", "Trabajos en habitación".

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  - 6. Para eliminar, haz click en "Eliminar"


### 4 Registro de Habitación:

  - 1. Navega a la ruta `/rooms`.

  - 2. Haz click en "Nueva Habitación" (+).

  ![rooms](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-rooms.png)

  - 3. Completa los campos: "Piso", "Número", "Categoría", "Descripción", "Precio".

  ![new-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/new-room.png)

  - 4. Haz click en "Registrar".

  - 5. Para editar, haz click en "Editar"

  ![edit-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/edit-room.png)

  - 6. Para eliminar, haz click en "Eliminar"

  ![delete-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/delete-room.png)

  - 7. Para ver el historial, haz click en "Historial"

  ![history-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/history-rooms.png)


### 5. Mantenimiento de Habitación

- 1. En la vista principal de Hotel, selecciona la habitación que desees mantener.

![maintenance-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/options-room.png)

- 2. Haz click en "Mantenimiento".

- 3. Elige el tipo de mantenimiento que desees realizar.

- 4. Elige el usuario a cargo del mantenimiento.

- 5. Añade algunas observaciones o comentarios.

![maintenance-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/maintenance-room.png)

- 6. Haz click en "Actualizar".

- 7. Para finalizar, haz click en "Detalles"

![maintenance-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-room.png)

- 8. Y luego en "Finalizar".

![finalize-maintenance](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/finalize-maintenance-room.png)


### 6. Ocupación de Habitación

- 1. En la vista principal de Hotel, selecciona la habitación que desees ocupar.

![room-occupied](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/options-room.png)

- 2. Haz click en "Ocupar".

- 3. Llenar campos de "DNI", "Nombres Completos", "Celular", "Correo".

- 4. Establecer la fecha de fin del periodo de ocupación.

- 5. Agregar monto del pago adelantado.

- 6. Agregar algunas observaciones o comentarios.

![room-occupied](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/occupation-room.png)

- 7. Haz click en "Ocupar".


### 7. Reserva de Habitación

- 1. En la vista principal de Hotel, selecciona la habitación que desees reservar.

![room-reserved](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/options-room.png)

- 2. Haz click en "Reservar".

- 3. Llenar campos de "DNI", "Nombres Completos", "Celular", "Correo".

- 4. Establecer la fecha de incicio y fin del periodo de reserva.

- 5. Agregar monto del pago adelantado.

- 6. Agregar algunas observaciones o comentarios.

![room-reserved](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/reservation-room.png)

- 7. Haz click en "Reservar".


### 8. Limpieza Intermedia de Habitación

- 1. En la vista principal de Hotel, selecciona la habitación que desees limpiar.

![room-cleaning](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-room.png)

- 2. Haz click en "Detalles".

![details-occupation](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-occupation-room.png)

- 3. Haz click en "Limpieza intermedia".

![room-clean](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/clean-room.png)

- 4. Elige el usuario a cargo de la limpieza.

- 5. Añade algunas observaciones o comentarios.

![room-cleaning](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/cleaning-room.png)

- 6. Haz click en "Actualizar".


### 9. Venta a la habitación

- 1. En la vista principal de Hotel, selecciona la habitación en la que desees realizar una venta.

![room-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-room.png)

- 2. Haz click en "Detalles".

![details-occupation](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-occupation-room.png)

- 3. Haz click en "Vender".

![room-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/sale-room.png)

- 4. En la barra de búsqueda busca los productos del almacén del hotel que desees agregar al carrito.

- 5. Añade la cantidad de productos, y aplica descuento si es necesario.

- 6. Agrega un importe de adelanto o descuento si es necesario.

- 7. Añade algunas observaciones o comentarios.

![room-sale](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/sale-to-room.png)

- 8. Haz click en "Vender".


### 10. CheckOut

- 1. En la vista principal de Hotel, selecciona la habitación en la que desees realizar un checkout.

![checkout-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-room.png)

- 2. Haz click en "Detalles".

![details-occupation](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/details-occupation-room.png)

- 3. Haz click en "CheckOut".

- 4. Agrega costo adiciona, descuento y comentarios si es necesario.

![checkout-room](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/checkout-room.png)

- 5. Haz click en "CheckOut".


### 11. Salidas de hotel

- 1. Navega a la ruta `/checkouts`.

![checkouts](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-checkouts.png)


### 12. Cierre de caja de hotel

- 1. Navega a la ruta `/checkouts`.

- 2. Haz click en "Cerrar Checkouts".


### 23. Balance de hotel

- 1. Navega a la ruta `/balance-hotel`.

![balance-hotel](https://github.com/Aleixs-Trejo/inventario-aprendedor/blob/main/screenshots/all-balance-hotel.png)


## Contactar a soporte

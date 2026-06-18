// 1. DECLARACIÓN DEL CARRITO (Arreglo vacío donde guardaremos los productos)
let carrito = [];

// 2. REFERENCIAS A LOS ELEMENTOS DEL HTML (Enganchamos los IDs que pusimos en el HTML)
const contadorCarrito = document.getElementById('cart-counter');
const contenedorProductos = document.getElementById('products-grid');

// 3. ESCUCHADOR DE EVENTOS (Detectar clics en toda la zona de productos)
if (contenedorProductos) {
    contenedorProductos.addEventListener('click', (e) => {
        // Verificamos si el usuario le dio clic específicamente al botón de "Agregar"
        if (e.target.classList.contains('add-to-cart-btn')) {
            
            // Obtenemos el contenedor de la tarjeta del producto para jalar sus datos
            const tarjetaProducto = e.target.closest('.product-card');
            
            // Creamos un objeto con la información del producto seleccionado
            const productoSeleccionado = {
                id: e.target.getAttribute('data-id'),
                titulo: tarjetaProducto.querySelector('.product-title').textContent,
                precio: parseFloat(tarjetaProducto.querySelector('.product-price').textContent.replace('$', '')),
                cantidad: 1
            };

            // Ejecutamos la función para añadirlo al arreglo
            agregarAlCarrito(productoSeleccionado);
        }
    });
}

// 4. FUNCIÓN PARA AGREGAR EL PRODUCTO AL ARREGLO
function agregarAlCarrito(producto) {
    // Revisamos si el producto ya existe en el carrito
    const existe = carrito.find(item => item.id === producto.id);

    if (existe) {
        // Si ya existe, solo le sumamos 1 a su cantidad
        existe.cantidad++;
    } else {
        // Si es nuevo, lo empujamos al arreglo del carrito
        carrito.push(producto);
    }

    // Actualizamos la interfaz visual de la página
    actualizarInterfaz();
}

// 5. FUNCIÓN PARA ACTUALIZAR LOS NÚMEROS EN LA PÁGINA
function actualizarInterfaz() {
    // Calculamos el total de piezas sumando las cantidades de cada producto
    const totalPiezas = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    // Cambiamos el texto del contador del botón del HTML por el número real
    contadorCarrito.textContent = totalPiezas;

    // Imprimimos en la consola de VS Code/Navegador para verificar que todo funcione
    console.log("Contenido del carrito actual:", carrito);
}
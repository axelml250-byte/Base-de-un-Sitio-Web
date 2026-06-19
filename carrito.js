// 1. INICIALIZACIÓN: Jalamos el carrito guardado en el navegador, si no hay nada, inicia vacío
let carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];

// 2. REFERENCIAS GLOBALES
const contadorCarrito = document.getElementById('cart-counter');
const tablaBody = document.getElementById('tabla-carrito-body');
const totalAmount = document.getElementById('cart-total-amount');

// Ejecutar funciones básicas al cargar la página
actualizarContadorVisual();
if (tablaBody) {
    dibujarTablaCarrito();
}

// 3. CAPTURAR CLICS DE AGREGAR (Para index.html y productos.html)
const contenedorProductos = document.getElementById('products-grid');
if (contenedorProductos) {
    contenedorProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const tarjetaProducto = e.target.closest('.product-card');
            
            const productoSeleccionado = {
                id: e.target.getAttribute('data-id'),
                titulo: tarjetaProducto.querySelector('.product-title').textContent,
                precio: parseFloat(tarjetaProducto.querySelector('.product-price').textContent.replace('$', '')),
                cantidad: 1
            };

            agregarAlCarrito(productoSeleccionado);
        }
    });
}

// 4. FUNCIÓN PARA AÑADIR PRODUCTOS
function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push(producto);
    }

    // GUARDAR EN EL NAVEGADOR (Magia para multipágina)
    localStorage.setItem('productosCarrito', JSON.stringify(carrito));
    
    actualizarContadorVisual();
    alert(`¡${producto.titulo} agregado al carrito!`);
}

// 5. FUNCIÓN PARA ACTUALIZAR EL CONTADOR DEL MENÚ
function actualizarContadorVisual() {
    if (contadorCarrito) {
        const totalPiezas = carrito.reduce((total, item) => total + item.cantidad, 0);
        contadorCarrito.textContent = totalPiezas;
    }
}

// 6. FUNCIÓN EXCLUSIVA PARA LA PÁGINA CARRITO.HTML (Dibuja la tabla)
function dibujarTablaCarrito() {
    // Limpiamos la tabla por si acaso
    tablaBody.innerHTML = '';
    let sumaTotal = 0;

    if (carrito.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999;">Tu carrito está vacío.</td></tr>`;
        totalAmount.textContent = '0.00';
        return;
    }

    // Recorremos el carrito y creamos las filas de la tabla
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        sumaTotal += subtotal;

        const fila = document.createElement('tr');
        fila.style.borderBottom = '1px solid #eee';
        fila.innerHTML = `
            <td style="padding: 12px; font-weight: 500;">${item.titulo}</td>
            <td style="padding: 12px;">$${item.precio.toFixed(2)}</td>
            <td style="padding: 12px;">${item.cantidad}</td>
            <td style="padding: 12px; font-weight: bold; color: #2c3e50;">$${subtotal.toFixed(2)}</td>
            <td style="padding: 12px;">
                <button onclick="eliminarProducto('${item.id}')" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Eliminar
                </button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    // Actualizamos el total general en la pantalla
    totalAmount.textContent = sumaTotal.toFixed(2);
}

// 7. FUNCIÓN PARA ELIMINAR ARTÍCULOS DESDE LA TABLA
function eliminarProducto(id) {
    // Filtramos el arreglo para sacar el producto seleccionado
    carrito = carrito.filter(item => item.id !== id);
    
    // Actualizamos la minibase de datos del navegador
    localStorage.setItem('productosCarrito', JSON.stringify(carrito));
    
    // Refrescamos los componentes visuales
    actualizarContadorVisual();
    dibujarTablaCarrito();
}

// 8. PREPARACIÓN PARA MERCADO PAGO
const botonCheckout = document.getElementById('checkout-btn');
if (botonCheckout) {
    botonCheckout.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de pagar.");
            return;
        }
        
        alert("¡Conexión exitosa! En la siguiente etapa, este botón mandará los datos a tu servidor en Java/PHP para generar el link real de Mercado Pago con el total de $" + totalAmount.textContent);
        
        /* 
        Nota de arquitectura para el futuro:
        Aquí se hace un fetch() mandando el arreglo 'carrito' a tu backend.
        Tu Backend de Java/PHP procesa los precios reales desde la base de datos, 
        se conecta a la API de Mercado Pago y nos devuelve una URL (Preference ID).
        Luego hacemos un: window.location.href = urlMercadoPago;
        */
    });
}
// 1. INICIALIZACIÓN CON FILTRO: Jalamos el carrito pero expulsamos de inmediato los que tengan cantidad 0
let carrito = (JSON.parse(localStorage.getItem('productosCarrito')) || [])
                .filter(item => item.cantidad > 0);

// Después de filtrar, aseguramos que el localStorage quede limpio sin esos ceros
localStorage.setItem('productosCarrito', JSON.stringify(carrito));
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
        // Solo sumamos las cantidades de los productos que sean mayores a 0
        const totalPiezas = carrito
            .filter(item => item.cantidad > 0)
            .reduce((total, item) => total + item.cantidad, 0);
            
        contadorCarrito.textContent = totalPiezas;
    }
}

// =========================================================================
// 6. FUNCIÓN REESCRITA: Dibuja la tabla con botones de flechas (+ / -)
// =========================================================================
function dibujarTablaCarrito() {
    tablaBody.innerHTML = '';
    let sumaTotal = 0;

    if (carrito.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999;">Tu carrito está vacío.</td></tr>`;
        totalAmount.textContent = '0.00';
        return;
    }

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        sumaTotal += subtotal;

        const fila = document.createElement('tr');
        fila.style.borderBottom = '1px solid #eee';
        fila.innerHTML = `
            <td style="padding: 12px; font-weight: 500;">${item.titulo}</td>
            <td style="padding: 12px;">$${item.precio.toFixed(2)}</td>
            
            <!-- COLUMNA DE CANTIDAD CON FLECHAS -->
            <td style="padding: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <!-- Flecha izquierda (Restar) -->
                    <button onclick="cambiarCantidad('${item.id}', -1)" style="background: #3498db; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        ◀
                    </button>
                    
                    <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.cantidad}</span>
                    
                    <!-- Flecha derecha (Sumar) -->
                    <button onclick="cambiarCantidad('${item.id}', 1)" style="background: #3498db; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        ▶
                    </button>
                </div>
            </td>
            
            <td style="padding: 12px; font-weight: bold; color: #2c3e50;">$${subtotal.toFixed(2)}</td>
            <td style="padding: 12px;">
                <button onclick="eliminarProducto('${item.id}')" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Eliminar
                </button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    totalAmount.textContent = sumaTotal.toFixed(2);
}

// =========================================================================
// 新 NUEVA FUNCIÓN: Controla el aumento o disminución dinámica
// =========================================================================
function cambiarCantidad(id, cambio) {
    const producto = carrito.find(item => item.id === id);
    
    if (producto) {
        const nuevaCantidad = producto.cantidad + cambio;
        
        // Evitamos que baje de cero
        if (nuevaCantidad < 0) return;

        // Actualizamos la cantidad en la memoria viva (puede llegar a ser 0)
        producto.cantidad = nuevaCantidad;

        // ¡LA CLAVE! Guardamos el estado actual (incluyendo el 0) en el navegador
        localStorage.setItem('productosCarrito', JSON.stringify(carrito));
        
        // Actualizamos el globito del menú y redibujamos la tabla
        actualizarContadorVisual();
        dibujarTablaCarrito();
    }
}

// Función auxiliar para que el globito verde del menú también refleje el "0" temporal si corresponde
function actualizarContadorTemporalEspecial() {
    if (contadorCarrito) {
        const totalPiezas = carrito.reduce((total, item) => total + item.amount, 0); // Tomará en cuenta el cero
        const piezasFiltradas = carrito.reduce((total, item) => total + item.cantidad, 0);
        contadorCarrito.textContent = piezasFiltradas;
    }
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
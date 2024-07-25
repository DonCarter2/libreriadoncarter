import { buscarLibros, buscarLibrosPorNombre, hacerPedido } from "./supabase.js";

const estructuraHTML = (book, index) => {
    // Asumimos que book.autor es un array de autores
    let autores = Array.isArray(book.autor) ? book.autor : [];
    // Si `book.autor` es una cadena JSON
    autores = JSON.parse(book.autor);
    return `
    <div class="card col-md-6 ms-3 mb-3" style="width: 18rem;" data-index="${index}" id="${book.isbn}">
        <img src="${book.portada}" class="card-img-top" alt="Portada del libro" style="height: 300px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title">${book.titulo}</h5>
            <p class="card-text">Autores: ${autores[0]}</p>
            <p class="card-text">Publicado: ${book.fecha_publicacion}</p>
            <p class="card-text price">Precio: $${book.precio}</p>
            <p class="card-text stock">Stock: ${book.stock}</p>
        </div>
        <div class="text-center mb-2">
            <button class="btn btn-outline-primary btnCart">Agregar al Carrito</button>
            <button class="btn btn-outline-danger btnPagar" style="display: none;">Eliminar del Carrito</button>
        </div>
    </div>`;
};


const mostrarLibros = (libros) => {
    const bookContainer = document.getElementById('catalogo');
    bookContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los libros

    if (libros.length === 0) {
        bookContainer.innerHTML = '<p>No se encontraron libros.</p>';
        return;
    }

    libros.forEach((book, index) => {
        bookContainer.innerHTML += estructuraHTML(book, index);
    });
};

const libros = await buscarLibros()

libros.forEach(book => {
    const catalogo = document.getElementById("catalogo")
    catalogo.innerHTML += estructuraHTML(book)

})

// Manejar la búsqueda de libros
document.getElementById('formSearchBar').addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchTerm = document.getElementById('search').value.trim().toLowerCase();

    if (searchTerm === "") {
        mostrarLibros(await buscarLibros());
    } else {
        mostrarLibros(await buscarLibrosPorNombre(searchTerm));
    }
});


const addToCart = async (bookCard) => {
    const bookId = bookCard.id;
    const cartItems = document.getElementById("cart-items");

    const clonedBookCard = bookCard.cloneNode(true);

    const addButton = clonedBookCard.querySelector(".btnCart");
    if (addButton) addButton.remove();

    const removeButton = clonedBookCard.querySelector('.btnPagar');

    if (removeButton) removeButton.style.display = 'block';

    removeButton.addEventListener("click", async () => {
        clonedBookCard.remove();
    });

    cartItems.appendChild(clonedBookCard);
};

const addCartButtonEvents = () => {
    const cartButtons = document.querySelectorAll(".btnCart");
    cartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const bookCard = button.closest('.card');
            addToCart(bookCard);
        });
    });
};

addCartButtonEvents()

const pagar = () => {
    const cartItems = document.querySelectorAll("#cart-items .card");
    let bookTitles = [];
    let totalPrice = 0;
    let totalQuantity = 0;

    cartItems.forEach(item => {
        const title = item.querySelector('.card-title').textContent.trim();
        const priceText = item.querySelector('.price').textContent.trim();
        const priceMatch = priceText.match(/\$([\d,\.]+)/);
        const price = priceMatch ? parseInt(priceMatch[1].replace(',', '')) : 0;

        bookTitles.push(title);
        totalPrice += price;
        totalQuantity += 1;
    });
    const fechaPedido = new Date().toISOString();

    // Mostrar alerta de SweetAlert para pedir el nombre y apellido del cliente
    Swal.fire({
        title: 'Ingrese su nombre y apellido',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Apellido">',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('swal-input1').value;
            const apellido = document.getElementById('swal-input2').value;
            if (!nombre || !apellido) {
                Swal.showValidationMessage('Por favor ingrese su nombre y apellido');
                return false;
            }
            return { nombre, apellido };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const nombreCompleto = `${result.value.nombre} ${result.value.apellido}`;
            const pedido = await hacerPedido(localStorage.getItem("userid"), bookTitles, totalPrice, totalQuantity, nombreCompleto, fechaPedido);
            localStorage.setItem("idPedido", pedido[0].id)
            window.location.href = "views/pago.html"
        }
    });
};

document.getElementById("btnPagar").addEventListener("click", pagar);

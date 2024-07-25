const apiUrl = 'https://openlibrary.org';

const estructuraHTML = (book) => {
    // Verifica si el libro tiene información de imagen de portada disponible
    const coverUrl = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` 
        : 'https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';

    const html = `
    <div class="card col-md-4 ms-3" style="width: 400px;">
        <div class="card">
            <div class="card-header">
                <img 
                    src="${coverUrl}" 
                    alt="Portada del libro" 
                    class="img-fluid rounded ps-3" 
                    onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';">
            </div>
            <div class="card-body">
                <p>Titulo: ${book.title}</p>
                <p>Autores: ${book.author_name ? book.author_name.join(', ') : 'Desconocido'}</p>
                <p>Publicado: ${book.publish_year ? book.publish_year[0] : 'Desconocido'}</p>
            </div>
        </div>
    </div>`;
    return html;
};

const searchBooks = async (query) => {
    const url = `${apiUrl}/search.json?q=${query}&limit=3`;

    try {
        // Realiza la solicitud GET a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener la información de libros.');
        }
        
        // Convierte la respuesta a JSON
        const data = await response.json();
        const books = data.docs.slice(0, 3); // Limitamos a 3 libros
        const catalogoDiv = document.getElementById("catalogo");

        // Genera y agrega las tarjetas de libros al contenedor
        books.forEach(book => {
            const bookHTML = estructuraHTML(book);
            catalogoDiv.innerHTML += bookHTML;
        });

    } catch (error) {
        console.error('Error al buscar libros:', error);
    }
};

document.querySelectorAll(".btn-outline-primary").forEach(btn => {
    const values = btn.value
    btn.addEventListener("click", async () => {
        window.location.href = `templates/catalogo.html?categories=${values}`
    })
});

searchBooks("brandon sanderson");

import { getPedidoByUserId, obtenerUserPorid } from "../supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    let linkPerfil = document.querySelector('a.nav-link[href="#Perfil"]');
    let linkVentas = document.querySelector('a.nav-link[href="#Ventas"]');

    // Obtener las secciones a mostrar/ocultar
    let perfil = document.getElementById('Perfil');
    let ventas = document.getElementById('Ventas'); // Cambié aquí el ID para que coincida con el HTML

    if (linkPerfil && linkVentas && perfil && ventas) {
        // Manejar clic en el enlace para mostrar la sección de perfil
        linkPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            perfil.style.display = 'flex';
            ventas.style.display = 'none';
        });

        // Manejar clic en el enlace para mostrar la sección de ventas
        linkVentas.addEventListener('click', (e) => {
            e.preventDefault();
            perfil.style.display = 'none';
            ventas.style.display = 'block';
        });
    } else {
        console.error('No se encontraron algunos de los enlaces o secciones.');
    }
});

const obtenerPedidos = async () => {
    const user = await obtenerUserPorid(localStorage.getItem("userid"))
    const pedidos = await getPedidoByUserId(localStorage.getItem("userid"))
    console.log(pedidos)

    const tabla = document.getElementById("pedidos")

    pedidos.forEach(async pedido => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${pedido.id}</td>
          <td>${user[0].nombrecompleto}</td>
          <td>${pedido.NombreCompleto}</td>
          <td><ul>${pedido.isbn_libro.map(item => `<li>${item}</li>`).join("")}</ul></td>
          <td>${pedido.cantidad}</td>
          <td>$${pedido.precio_total}</td>
          <td>${pedido.fechaPedido}</td>
      `;
        tabla.appendChild(fila);
    })
}

const cargarPerfil = async () => {
    const idText = document.getElementById("IDText")
    const nameText = document.getElementById("NameText")
    const emailText = document.getElementById("EmailText")

    const user = await obtenerUserPorid(localStorage.getItem("userid"))

    idText.innerHTML = "ID: " + user[0].id
    nameText.innerHTML = "Nombre: " + user[0].nombrecompleto
    emailText.innerHTML = "Email: " + user[0].email
}

obtenerPedidos()
cargarPerfil()

document.getElementById("closeSessionBtn").addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "../../index.html"
})
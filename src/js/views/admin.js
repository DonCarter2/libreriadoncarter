import { getPedidos, getUsuarios, obtenerUserPorid, eliminarUser } from "../supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  let linkPerfil = document.querySelector('a.nav-link[href="#Perfil"]');
  let linkVentas = document.querySelector('a.nav-link[href="#Ventas"]');
  let linkEmpleados = document.querySelector('a.nav-link[href="#Empleados"]');

  // Obtener las secciones a mostrar/ocultar
  let perfil = document.getElementById('Perfil');
  let ventas = document.getElementById('Pedidos'); // Cambié aquí el ID para que coincida con el HTML
  let empleados = document.getElementById('Empleados');

  if (linkPerfil && linkVentas && linkEmpleados && perfil && ventas && empleados) {
    // Manejar clic en el enlace para mostrar la sección de perfil
    linkPerfil.addEventListener('click', (e) => {
      e.preventDefault();
      perfil.style.display = 'flex';
      ventas.style.display = 'none';
      empleados.style.display = 'none';
    });

    // Manejar clic en el enlace para mostrar la sección de ventas
    linkVentas.addEventListener('click', (e) => {
      e.preventDefault();
      perfil.style.display = 'none';
      ventas.style.display = 'block';
      empleados.style.display = 'none';
    });

    // Manejar clic en el enlace para mostrar la sección de empleados
    linkEmpleados.addEventListener('click', (e) => {
      e.preventDefault();
      perfil.style.display = 'none';
      ventas.style.display = 'none';
      empleados.style.display = 'block';
    });
  } else {
    console.error('No se encontraron algunos de los enlaces o secciones.');
  }
});
const obtenerUsuarios = async () => {
  const users = await getUsuarios()

  const tabla = document.getElementById("empleados")

  users.forEach(user => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nombrecompleto}</td>
        <td>${user.email}</td>
        <td><button class="btn btn-outline-danger btn-eliminar" id=${user.id}>Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  })

  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", async () => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, bórralo!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const eliminar = await eliminarUser(btn.id)
          // Mostrar mensaje de éxito al eliminar la cuenta
          if (eliminar) {
            Swal.fire({
              title: "¡Borrado!",
              text: "Cuenta eliminada con éxito",
              icon: "success",
            }).then(r => {
              if (r.isConfirmed) {
                window.location.reload()
              }
            })
          } else {
            // Mostrar mensaje de error si hubo un problema al eliminar la cuenta
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al eliminar el usuario",
            })
          }
        }
      })
    })
  })
}

const obtenerPedidos = async () => {
  const pedidos = await getPedidos()

  const tabla = document.getElementById("pedidos")

  pedidos.forEach(async pedido => {
    const user = await obtenerUserPorid(pedido.id_user)
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

cargarPerfil()
obtenerPedidos()
obtenerUsuarios()

document.getElementById("closeSessionBtn").addEventListener("click", () => {
  localStorage.clear()
  window.location.href = "../../index.html"
})
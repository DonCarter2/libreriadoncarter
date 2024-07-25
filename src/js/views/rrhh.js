import { getUsuarios, eliminarUser, obtenerUserPorid } from "../supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    let linkPerfil = document.querySelector('a.nav-link[href="#Perfil"]');
    let linkEmpleados = document.querySelector('a.nav-link[href="#Empleados"]');

    // Obtener las secciones a mostrar/ocultar
    let perfil = document.getElementById('Perfil');
    let empleados = document.getElementById('Empleados');

    if (linkPerfil && linkEmpleados && perfil && empleados) {
        // Manejar clic en el enlace para mostrar la sección de perfil
        linkPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            perfil.style.display = 'flex';
            empleados.style.display = 'none';
        });


        // Manejar clic en el enlace para mostrar la sección de empleados
        linkEmpleados.addEventListener('click', (e) => {
            e.preventDefault();
            perfil.style.display = 'none';
            empleados.style.display = 'block';
        });
    } else {
        console.error('No se encontraron algunos de los enlaces o secciones.');
    }
});

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const sumarMeses = (fecha, meses) => {
    const nuevaFecha = new Date(fecha); // Clona la fecha original
    const mesActual = nuevaFecha.getMonth();

    // Suma los meses
    nuevaFecha.setMonth(mesActual + meses);

    // Ajusta el día si se sale del rango del mes
    if (nuevaFecha.getMonth() !== (mesActual + meses) % 12) {
        nuevaFecha.setDate(0); // Ajusta al último día del mes anterior
    }

    // Formateo de la fecha
    const dia = String(nuevaFecha.getDate()).padStart(2, '0');
    const mes = months[nuevaFecha.getMonth()]; // Nombre del mes en español
    const anio = nuevaFecha.getFullYear();
    const diaSemana = daysOfWeek[nuevaFecha.getDay()]; // Nombre del día en español

    return `${diaSemana} ${dia} de ${mes} de ${anio}`;
}


const obtenerUsuarios = async () => {
    const users = await getUsuarios()

    const tabla = document.getElementById("empleados")

    users.forEach(user => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${user.id}</td>
          <td>${user.nombrecompleto}</td>
          <td>${user.email}</td>
          <td>${sumarMeses(new Date('2024-07-23'), 3)}</td>
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

const cargarPerfil = async () => {
    const idText = document.getElementById("IDText")
    const nameText = document.getElementById("NameText")
    const emailText = document.getElementById("EmailText")

    const user = await obtenerUserPorid(localStorage.getItem("userid"))

    idText.innerHTML = "ID: " + user[0].id
    nameText.innerHTML = "Nombre: " + user[0].nombrecompleto
    emailText.innerHTML = "Email: " + user[0].email
}

obtenerUsuarios()
cargarPerfil()


document.getElementById("closeSessionBtn").addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "../../index.html"
})
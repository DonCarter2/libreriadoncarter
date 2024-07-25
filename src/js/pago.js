import { actualizarStockLibro, cancelarPedido, getPedidoById, obtenerUserPorid } from './supabase.js'

const loadCartItems = async () => {
    try {
        const pedido = await getPedidoById(localStorage.getItem("idPedido"))
        const user = await obtenerUserPorid(pedido.id_user)

        if (!pedido || !user) {
            console.error('No se encontraron datos para mostrar.')
            return
        }

        const tableBody = document.getElementById('cart-table-body')
        tableBody.innerHTML = '' // Limpiar el cuerpo de la tabla

        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${user[0].nombrecompleto}</td>
            <td>${pedido.NombreCompleto}</td>
            <td><ul>${pedido.isbn_libro.map(item => `<li>${item}</li>`).join("")}</ul></td>
            <td>${pedido.cantidad}</td>
            <td>$${pedido.precio_total}</td>
            <td>${pedido.fechaPedido}</td>
            <td><button class="btn btn-danger btnEliminar" id="${pedido.id}"><i class="bi bi-trash3-fill"></i></button></td>
        `

        document.getElementById('total-amount').value = pedido.precio_total

        tableBody.appendChild(row)

        document.querySelectorAll('.btnEliminar').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    await cancelarPedido(button.id)
                    loadCartItems() // Recargar los datos del carrito
                } catch (error) {
                    console.error('Error al cancelar el pedido:', error)
                }
            })
        })
    } catch (error) {
        console.error('Error al cargar los artículos del carrito:', error)
    }
}

const actualizarStock = async () => {
    const idPedido = localStorage.getItem("idPedido");
    const pedido = await getPedidoById(idPedido);

    // Asegurarse de que isbn_libro sea un array
    if (!Array.isArray(pedido.isbn_libro)) {
        console.error("isbn_libro no es un array");
        return;
    }

    for (const isbn of pedido.isbn_libro) {
        const stock = await actualizarStockLibro(isbn, 1);
        console.log(`Stock actualizado para ISBN ${isbn}:`, stock);
    }
} 
const paymentForm = document.getElementById('payment-form')
const efectivoSection = document.getElementById('efectivo-section')
const creditSection = document.getElementById('credit-section')
const debitSection = document.getElementById('debit-section')
const changeOutput = document.getElementById('change-output')

paymentForm.addEventListener('change', (event) => {
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked')

    if (selectedPaymentMethod && selectedPaymentMethod.value === 'efectivo') {
        efectivoSection.classList.remove('hidden')
        creditSection.classList.add('hidden')
        debitSection.classList.add('hidden')
    } else if (selectedPaymentMethod && selectedPaymentMethod.value === 'debito') {
        debitSection.classList.remove('hidden')
        creditSection.classList.add('hidden')
        efectivoSection.classList.add('hidden')
    } else if (selectedPaymentMethod && selectedPaymentMethod.value === 'credito') {
        creditSection.classList.remove('hidden')
        debitSection.classList.add('hidden')
        efectivoSection.classList.add('hidden')
    } else {
        creditSection.classList.add('hidden')
        debitSection.classList.add('hidden')
        efectivoSection.classList.add('hidden')
        changeOutput.classList.add('hidden')
    }
})

document.getElementById("btnFinPago").addEventListener("click", () => {
    actualizarStock()
    localStorage.removeItem("idPedido")
    window.location.href = "../../index.html"
})
document.getElementById("btnFinPagoDebit").addEventListener("click", () => {
    actualizarStock()
    localStorage.removeItem("idPedido")
    window.location.href = "../../index.html"
})
document.getElementById("btnFinPagoCredit").addEventListener("click", () => {
    actualizarStock()
    localStorage.removeItem("idPedido")
    window.location.href = "../../index.html"
})

function calculateChange() {
    const totalAmount = parseFloat(document.getElementById('total-amount').value)
    const cashGiven = parseFloat(document.getElementById('cash-given').value)

    if (isNaN(totalAmount) || isNaN(cashGiven) || cashGiven < totalAmount) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, ingrese valores válidos. Asegúrese de que el efectivo recibido sea al menos igual al total a pagar.",
        })
        return
    }

    const change = cashGiven - totalAmount
    changeOutput.innerHTML = `Vuelto: $${change}`
    changeOutput.classList.remove('hidden')
}

document.getElementById("vuelto").addEventListener("click", () => {
    calculateChange()
})

loadCartItems()
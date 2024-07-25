import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://zkjgptkufaidvwsgdqgu.supabase.co/', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpramdwdGt1ZmFpZHZ3c2dkcWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMTIxODAsImV4cCI6MjAzNjY4ODE4MH0.q5On2mNtWRt1j7fAnxdL9r_6fKa6hKUmZzls9Wghnyw'
)

export const registerUser = async ( email, password, nombre, apellido ) => {
    // Insertar el nuevo usuario en la tabla Usuarios
    const { data, error } = await supabase
        .from('usuarios')
        .insert({ nombrecompleto: nombre + " " + apellido, email:email, contraseña:password })

    if (error) {
        console.error('Error registrando usuario:', error)
        return false
    }

    return true
}

export const actualizarStockLibro = async (nombreLibro) => {
    // Obtener el stock actual del libro
    const { data, error: getError } = await supabase
        .from("libros")
        .select("stock")
        .eq("titulo", nombreLibro)
        .single();

    if (getError) {
        console.error("Error obteniendo el stock actual:", getError);
        return false;
    }

    const stockActual = data.stock;

    // Restar uno al stock actual
    const { error: updateError } = await supabase
        .from("libros")
        .update({ stock: stockActual - 1 })
        .eq("titulo", nombreLibro);

    if (updateError) {
        console.error("Error actualizando el stock:", updateError);
        return false;
    }

    return true;
}

// Función para iniciar sesión
export const loginUser = async (email, password) => {
    // Buscar el usuario por email
    const { data, error } = await supabase
        .from('usuarios')
        .select(' id, email, contraseña ')
        .eq('email', email)

    if (error) {
        console.error('Error buscando usuario:', error)
        return false
    }

    const user = data[0]

    // Verificar la contraseña directamente
    if (password != user.contraseña) {
        console.error('Contraseña incorrecta')
        return false
    }
    if (user.email === "RRHH@gmail.com" && user.contraseña === "RRHH123"){
        localStorage.setItem("userid",user.id)
        return "RRHH"
    } else if (user.email === "ADMIN@gmail.com" && user.contraseña === "ADMIN123"){
        localStorage.setItem("userid",user.id)
        return "ADMIN"
    } else {
        localStorage.setItem("userid",user.id)
        return true
    }

}

export const buscarLibrosPorNombre = async (nombreLibro) => {
    const { data, error } = await supabase
        .from('libros')
        .select('*')
        .ilike('titulo', `%${nombreLibro}%`);
    
    if (error) {
        console.error('Error buscando libros:', error);
        return [];
    }
    return data;
}

export const buscarLibros = async () => {
    const {data, error} = await supabase 
    .from("libros")
    .select("*")

    if(error){
        console.error(error)
    }

    return data
}

export const obtenerUserPorid = async (id) => {
    const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq("id", id)

    if(error){
        console.error(error)
    }

    return data
}

export const hacerPedido = async (userId, cartItems, totalPrice, cant, name, fecha) => {
    const { data, error } = await supabase
        .from('detalles_pedido')
        .insert({
            id_user: userId,
            isbn_libro: cartItems,
            cantidad: cant,
            precio_total: totalPrice,
            NombreCompleto: name,
            fechaPedido: fecha
        })
        .select("id")

    if (error) {
        console.error('Error al crear el pedido:', error);
        throw error;
    }
    console.log(data)
    return data // Devolver el pedido creado
};

export const updateOrder = async (pedidoId, cantidad, precioTotal) => {
    const { data, error } = await supabase
        .from('detalles_pedido')
        .update({
            cantidad: cantidad,
            precio_total: precioTotal
        })
        .eq('id', pedidoId);

    if (error) {
        console.error('Error al actualizar el pedido:', error);
        throw error; // Opcional: lanzar el error para que el código llamador pueda manejarlo
    }
    return data;
};

export const cancelarPedido = async (pedidoId) => {
    const { error } = await supabase
    .from("detalles_pedido")
    .delete()
    .eq("id", pedidoId)

    if (error) {
        console.error('Error al actualizar el pedido:', error);
        throw error; // Opcional: lanzar el error para que el código llamador pueda manejarlo
    }
    return true
}

export const eliminarUser = async (userId) => {
    const { error: errorPedidos } = await supabase
        .from("detalles_pedido")
        .delete()
        .eq("id_user", userId);

    if (errorPedidos) {
        console.error('Error al eliminar pedidos:', errorPedidos);
        throw errorPedidos;
    }

    const { error } = await supabase
    .from("usuarios")
    .delete()
    .eq("id", userId)

    if (error) {
        console.error('Error al actualizar el pedido:', error);
        throw error; // Opcional: lanzar el error para que el código llamador pueda manejarlo
    }
    return true
}

export const getPedidoById = async (orderId) => {
    const { data, error } = await supabase
        .from('detalles_pedido')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) {
        console.error('Error obteniendo el pedido:', error);
        return null;
    }

    return data;
};

export const getPedidoByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('detalles_pedido')
        .select('*')
        .eq('id_user', userId)

    if (error) {
        console.error('Error obteniendo el pedido:', error);
        return null;
    }

    return data;
};

export const getPedidos = async () => {
    const { data, error } = await supabase
        .from('detalles_pedido')
        .select('*')

    if (error) {
        console.error('Error obteniendo el pedido:', error);
        return null;
    }

    return data;
}

export const getUsuarios = async () => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')

    if (error) {
        console.error('Error obteniendo el pedido:', error);
        return null;
    }

    return data;
}

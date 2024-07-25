import { loginUser, registerUser } from "./supabase.js"

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-login-register');
    const toggleLink = document.getElementById('toggle-link');
    const registerFields = document.getElementById('register-fields');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    let isLogin = true;

    toggleLink.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = 'Iniciar Sesión';
            submitButton.textContent = 'Ingresar';
            toggleLink.textContent = '¿No tienes una cuenta? Regístrate';
            registerFields.style.display = 'none';
        } else {
            formTitle.textContent = 'Registrarse';
            submitButton.textContent = 'Registrarse';
            toggleLink.textContent = '¿Ya tienes una cuenta? Inicia sesión';
            registerFields.style.display = 'block';
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = form.email.value;
        const password = form.password.value;

        if (isLogin) {
            const login = await loginUser(email, password);
            if (login) {
                if (login === "ADMIN") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Inicio de sesión exitoso',
                        text: '¡Bienvenido de vuelta!',
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.location.href = "views/admin.html"
                        }
                    })
                } else if (login === "RRHH") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Inicio de sesión exitoso',
                        text: '¡Bienvenido de vuelta!',
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.location.href = "views/rrhh.html"
                        }
                    })
                } else {
                    // Mostrar alerta de éxito al iniciar sesión
                    Swal.fire({
                        icon: 'success',
                        title: 'Inicio de sesión exitoso',
                        text: '¡Bienvenido de vuelta!',
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.location.href = "views/user.html"
                        }
                    })
                }
            } else {
                // Mostrar alerta de error al iniciar sesión
                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar sesión',
                    text: 'Usuario o contraseña incorrectos. Por favor, inténtalo nuevamente.',
                });
            }
        } else {
            const nombre = form.nombre.value;
            const apellido = form.apellido.value;
            const register = await registerUser(email, password, nombre, apellido);
            if (register) {
                // Mostrar alerta de éxito al registrar usuario
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: '¡Usuario registrado correctamente!',
                });
            } else {
                // Mostrar alerta de error al registrar usuario
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar usuario',
                    text: 'Ha ocurrido un error al registrar el usuario. Por favor, inténtalo nuevamente.',
                });
            }
        }
    });
})


let paso = 1;
let pasoInicial = 1;
let pasoFinal = 3;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Mostrar y oculatar secciones
    tabs(); // Cambiar la seccion cuando se presionen los Tabs
    botonesPaginador(); // Agrega la funcion de paginacion a los botones Anterior y Siguiente
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta el API del backend PHP

    nombreCliente(); // Añade el nombre del cliente al obj de cita
    seleccionarFecha(); // Añade la fecha de la cita en el obj
    seleccionarHora(); // Añade la hora de la cita en el obj

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
    //Ocultar la seccion que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }
    // Seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase "actual" al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resltar el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`)    
    tab.classList.add('actual');
    
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function(e) {            
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        })        
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {

        if(paso <= pasoInicial) return;
        paso--;
        
        botonesPaginador();
    })
}
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {

        if(paso >= pasoFinal) return;
        paso++;
        
        botonesPaginador();
    })
}

async function consultarAPI() {
    try {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error){
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const {id, nombre, precio } = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$ ${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}

function seleccionarServicio(servicio) {
    const {id} = servicio;
    const {servicios} = cita;

    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado
    if(servicios.some(agregado => agregado.id === id)) {
        // Eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function nombreCliente() {
    const nombre = document.querySelector('#nombre').value;

    cita.nombre = nombre;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {

        const dia = new Date(e.target.value).getUTCDay();

        if([6,0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora no valida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // Previene que se generen mas de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    };

    // Scripting para la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    // Elimina la alerta despues de 3seg
    if(desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    // Validar que el objeto no tenga datos vacios
    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Falta Datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }

    // Formatear el Div de resumen
    const {nombre, fecha, hora, servicios} = cita;
    
    // Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen Servicios';
    resumen.appendChild(headingServicios);
    
    // Iterando y mostrando lo Servicios
    servicios.forEach(servicio => {
        const {id, precio, nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;
        
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        
        resumen.appendChild(contenedorServicio);
    })
    
    
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
}
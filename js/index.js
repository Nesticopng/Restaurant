const btnGuardarCliente = document.querySelector('#guardar-cliente')

let cliente = {
    mesa:'',
    hora:'',
    pedido:[]
}

const categorias = {
    1:'Pizza',
    2:'Postres',
    3:'Jugos',
    4:'Comida',
    5:'Cafe'
}

btnGuardarCliente.addEventListener('click',guardarCliente)

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa,hora].some(campo => campo === '')

    if(camposVacios){
        
        const existeAlerta = document.querySelector('.invalid-feedback')

        if (!existeAlerta) {
            const alerta = document.createElement('div')
            alerta.classList.add('invalid-feedback','d-block','text-center')
            alerta.textContent = 'Todos los campos son obligatorios'
            document.querySelector('.modal-body form').appendChild(alerta)
            setTimeout(()=>{
                alerta.remove();
            },3000);
        }

    }else{
        cliente = {...cliente,mesa,hora}

        let modalFormulario = document.querySelector('#formulario')
        let modal = bootstrap.Modal.getInstance(modalFormulario)
        modal.hide()

        mostrarSeccion()
        obtenerMenu()
    }
}

function mostrarSeccion(){
    const secciones = document.querySelectorAll('.d-none')
    secciones.forEach(seccion => seccion.classList.remove('d-none'))
 
}

function obtenerMenu(){
    const url = 'http://localhost:3000/menu'

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarMenu(resultado))
    .catch(error => console.log(error))
}

function mostrarMenu(menu){

    const contenido =  document.querySelector('#menu .contenido')

    menu.forEach(menu => {
        const fila = document.createElement('div')
        fila.classList.add('row','border-top')

        const nombre = document.createElement('div')
        nombre.classList.add('col-md-4','py-3')
        nombre.innerText = menu.nombre;

        const precio = document.createElement('div')
        precio.classList.add('col-md-4','py-3')
        precio.innerText = `$${menu.precio}`

        const categoria = document.createElement('div')
        categoria.classList.add('col-md-4','py-3')
        categoria.innerText = categorias[menu.categoria]

        const inputCantidad = document.createElement('input')
        inputCantidad.type = 'number'
        inputCantidad.min = 0
        inputCantidad.value = 0
        inputCantidad.id = `producto - ${menu.id}`
        inputCantidad.classList.add('form-control')
        inputCantidad.onchange = function (){
            const cantidad = parseInt(inputCantidad.value)

            agregarOrden({...menu},cantidad)
        }

        const agregar = document.createElement('div')
        agregar.classList.add('col-md-2','py-3')
        agregar.appendChild(inputCantidad)

        fila.appendChild(nombre)
        fila.appendChild(precio)
        fila.appendChild(categoria)
        fila.appendChild(inputCantidad)

        contenido.appendChild(fila)
    })
}

function agregarOrden(){
    let {pedido} = cliente

    if(producto.canitdad > 0){
        if(pedido.some(i=>i.id === producto.id)){
            const pedidoActualizado = pedido.map(item => {
                if(item.id === producto.id){
                    item.cantidad = producto.cantidad
                } 
                return i
            })

            cliente.pedido = [...pedidoActualizado]
        }
    }else{

        const resultado = pedido.filter(item => item.id !== producto.id)
        cliente.pedido=resultado
    }
    limpiarHTML();

    if (cliente.pedido.length) {

        actualizarResumen()
        
    } else {

        mensajePedidoVacio()
        
    }
}

function actualizarResumen() {

    const contenido = document.querySelector('#menu .contenido')
    const resumen = document.createElement('div')
    resumen.classList.add('col-md-6','card','py-5','px-3','shadow')

    const mesa = document.createElement('p')
    mesa.innerText = 'Mesa'
    mesa.classList.add('fw-bold')

    const mesaCliente = document.createElement('p')
    mesaCliente.innerText = cliente.mesa
    mesaCliente.classList.add('fw-normal')
    mesa.appendChild(mesaCliente)

    const hora = document.createElement('p')
    hora.innerText = 'Hora'
    hora.classList.add('fw-bold')

    const horaCliente = document.createElement('p')
    horaCliente.innerText = cliente.hora
    horaCliente.classList.add('fw-normal')
    hora.appendChild(horaCliente)

    const heading = document.createElement('h3')
    heading.innerText = 'Pedidos'
    heading.classList.add('my-4')

    const grupo = document.createElement('ul')
    grupo.classList.add('list-group')

    const {pedido} = cliente
    pedido.forEach(item => {
            const {nombre,cantidad,precio,id} = item
            const Lista = document.createElement('li')
            Lista.classList.add('list-group-item')

            const nombreP = document.createElement('h4')
            nombreP.classList.add('text-center','my-4')
            nombreP.innerText = nombre

            const cantidadP = document.createElement('p')
            cantidadP.classList.add('fw-bold')
            cantidadP.innerText = 'Canitdad'

            const cantidadValor = document.createElement('span')
            cantidadValor.classList.add('fw-normal')
            cantidadValor.innerText = `$${cantidad}`

            const precioP = document.createElement('p')
            precioP.classList.add('fw-bold')
            precioP.innerText = 'Precio'

            const precioValor = document.createElement('span')
            precioValor.classList.add('fw-normal')
            precioValor.innerText = `$${precio}`

            const subtotalP = document.createElement('p')
            subtotalP.classList.add('fw-bold')
            subtotalP.innerText = 'Subtotal'

            const subtotalValor = document.createElement('span')
            subtotalValor.classList.add('fw-normal')
            subtotalValor.innerText = calcularSubtotal(item)

            const btnEliminar = document.createElement('button')
            btnEliminar.classList.add('btn','btn-danger')
            btnEliminar.innerText = 'Eliminar pedido'

            btnEliminar.onclick = function(){
                eliminarProducto(id)
            }

       cantidadP.appendChild(cantidadValor)
       precioP.appendChild(precioValor)
       subtotalP.appendChild(subtotalValor)

       Lista.appendChild(nombreP)
       Lista.appendChild(cantidadP)
       Lista.appendChild(precioP)
       Lista.appendChild(subtotalP)
       Lista.appendChild(btnEliminar)

       grupo.appendChild(lista)
    })

    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(heading)
    resumen.appendChild(grupo)

    contenido.appendChild(resumen)
}

function calcularSubtotal(item) {
    const {cantidad, precio} = item
    return `$${cantidad * precio}`
    
}

function formularioPropinas() {

    const contenido = document.querySelector('#resumen .contenido')
    const formulario = document.createElement('div')
    formulario.classList.add('col-md-6','formulario')

    const heading = document.createElement('h3')
    heading.classList.add('my-4')
    heading.innerText = 'propina'

    const radio5 = document.createElement('input')
    radio5.type = 'radio'
    radio5.name = 'propina'
    radio5.value = '5'
    radio5.classList.add('form-check-input')
    radio5.onclick = calcularPropina

    const radioLabel5 = document.createElement('label')
    radioLabel5.innerText = '5%'
    radioLabel5.classList.add('form-check-label')

    const radioDiv5 = document.createElement('div')
    radioDiv5.classList.add('form-check')
    
    radioDiv5.appendChild(radio5)
    radioDiv5.appendChild(radioLabel5)

    formulario.appendChild(radioDiv5)
    contenido.appendChild(formulario)
}

function calcularPropina(){

    const radioSeleccionado = document.querySelector('[name="propina"]:checked').value

    const {pedido} = cliente

    let subtotal = 0
    pedido.forEach(item => {
        subtotal += item.cantidad * item.precio
    })

    const divTotales = document.createElement('div')
    divTotales.classList.add('total-pagar')

    const propina = (subtotal * (parseInt(radioSeleccionado))/100)
    const total = propina + subtotal;

    const subtotalParrafo = document.createElement('p')
    subtotalParrafo.classList.add('fs-3','fw-bold','mt-5')
    subtotalParrafo.innerText = 'Subtotal consumo:'

    const subtotalP = document.createElement('p')
    subtotalP.classList.add('fs-normal')
    subtotalP.innerText = `$${subtotal}`
    subtotalParrafo.appendChild(subtotalP)

    const propinaParrafo = documento.querySelector('span')
    propinaParrafo.classList.add('fs-normal')
    propinaParrafo.innerText = 'Propina:'
    
    const propinaP = document.createElement('span')
    propinaP.classList.add('fw-normal')
    propina.innerText = `$${propina}`
    propinaParrafo.appendChild(propinaP)

    const totalParrafo = document.createElement('p')
    totalParrafo.classList.add('fs-normal')
    totalParrafo.innerText = 'Total a pagar'

    const totalp = document.createElement('p')
    totalp.classList.add('fs-normal')
    totalp.innerText = `$${total}`

    totalParrafo.appendChild(totalp)

    const totalPagarDiv = document.querySelector('.total-pagar')

    if(totalPagarDiv){
        totalPagarDiv.remove()
    }
    
    divTotales.appendChild(subtotalParrafo)
    divTotales.appendChild(propinaParrafo)
    divTotales.appendChild(totalParrafo)

    const formulario = document.querySelector('.formulario')
    formulario.appendChild(divTotales)
}

function eliminarProducto(){
    const {pedido} = cliente
    cliente.pedido = pedido.filter(i => i.id !== id)

    limpiarHTML();

    if(cliente.pedido.length){
        actualizarResumen()
    }else{
        mensajePedidoVacio()
    }

    const productoEliminado = `#producto-${id}`
    const inputEliminado = document.querySelector(productoEliminado)
    inputEliminado.value = 0
}


function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen')
    const texto = document.createElement('p')
    texto.classList.add('text-center')
    texto.textContent = "debe agregar productos al pedido"

    contenido.appendChild(texto)
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido')
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild)
    }
}
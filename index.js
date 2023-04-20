
let empleados = [];
let usuario;
let formularioIdentificacion;
let contenedorIdentificacion;
let contenedorUsuario;
let textoUsuario;
let botonLimpiarStorage;

// Variables para formulario de Empleados
let modalAddLegajo;
let botonAgregarEmpleado;
let formulario;
let inputId;
let inputNombre;
let inputGenero;
let inputPuesto;
let inputSueldoBruto;
let inputAnios;
let contenedorEmpleados;
let botonesCerrarModalAgregarEmpleado;
let modal;

class Empleado {
  constructor(id, nombre, genero, puesto, sueldoBruto, anios) {
    this.id = id;
    this.nombre = nombre.toUpperCase();
    this.genero = genero.toUpperCase();
    this.puesto = puesto.toUpperCase();
    this.sueldoBruto = sueldoBruto;
    this.anios = anios;
  }
}

function inicializarElementos() {
  formularioIdentificacion = document.getElementById(
    "formularioIdentificacion"
  );
  inputUsuario = document.getElementById("inputUsuario");
  contenedorIdentificacion = document.getElementById(
    "contenedorIdentificacion"
  );
  contenedorUsuario = document.getElementById("contenedorUsuario");
  textoUsuario = document.getElementById("textoUsuario");

  botonLimpiarStorage = document.getElementById("limpiarStorage");
  formulario = document.getElementById("formularioAgregarEmpleado");
  inputId = document.getElementById("inputId");
  inputNombre = document.getElementById("inputNombreEmpleado");
  inputGenero = document.getElementById("inputGenero")
  inputPuesto = document.getElementById("inputPuesto");
  inputSueldoBruto = document.getElementById("inputSueldoBruto");
  inputAnios = document.getElementById("inputAnios");
  contenedorEmpleados = document.getElementById("contenedorEmpleados");

  botonesCerrarModalAgregarEmpleado = document.getElementsByClassName(
    "btnCerrarModalAgregarEmpleado"
  );
  modalAddLegajo = document.getElementById("modalAddLegajo");
  botonAgregarEmpleado = document.getElementById("btnAgregarEmpleado");
  modal = new bootstrap.Modal(modalAddLegajo);
}

function inicializarEventos() {
  formulario.onsubmit = (event) => validarFormulario(event);
  formularioIdentificacion.onsubmit = (event) => identificarUsuario(event);
  botonLimpiarStorage.onclick = eliminarStorage;
  botonAgregarEmpleado.onclick = abrirModalAgregarEmpleado;

  for (const boton of botonesCerrarModalAgregarEmpleado) {
    boton.onclick = cerrarModalAgregarEmpleado;
  }
}

function abrirModalAgregarEmpleado() {
  if (usuario) {
    modal.show();
  } else {
    alert("Identifíquese antes de agregar un Empleado");
  }
}

function cerrarModalAgregarEmpleado() {
  formulario.reset();
  modal.hide();
}

function eliminarStorage() {
  localStorage.clear();
  usuario = "";
  empleados = [];
  mostrarFormularioIdentificacion();
  pintarEmpleados();
}

function identificarUsuario(event) {
  event.preventDefault();
  usuario = inputUsuario.value;
  formularioIdentificacion.reset();
  actualizarUsuarioStorage();
  mostrarTextoUsuario();
}

function mostrarTextoUsuario() {
  contenedorIdentificacion.hidden = true;
  contenedorUsuario.hidden = false;
  textoUsuario.innerHTML += ` ${usuario}`;
}

function mostrarFormularioIdentificacion() {
  contenedorIdentificacion.hidden = false;
  contenedorUsuario.hidden = true;
  textoUsuario.innerHTML = ``;
}

function validarFormulario(event) {
  event.preventDefault();
  let idEmpleado = inputId.value;
  let nombre = inputNombre.value;
  let genero = inputGenero.value;
  let puesto = inputPuesto.value;
  let sueldoBruto = parseFloat(inputSueldoBruto.value);
  let anios = parseInt(inputAnios.value);

  const idExiste = empleados.some((empleado) => empleado.id === idEmpleado);
  if (!idExiste) {
    let empleado = new Empleado(
      idEmpleado,
      nombre,
      genero,
      puesto,
      sueldoBruto,
      anios
    );

    empleados.push(empleado);
    formulario.reset();
    actualizarEmpleadosStorage();
    pintarEmpleados();
    mostrarMensajeConfirmacion(
      `El empleado ${nombre} fue agregado exitosamente`,
      "info"
    );
  } else {
    alert("El id ya existe");
  }
}

function confirmarEliminacion(idEmpleado) {
  Swal.fire({
    icon: "question",
    title: "¿Estas seguro que quieres eliminar el producto?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarEmpleado(idEmpleado);
    }
  });
}

function eliminarEmpleado(idEmpleado) {
  let columnaBorrar = document.getElementById(`columna-${idEmpleado}`);
  let indiceBorrar = empleados.findIndex(
    (empleado) => Number(empleado.id) === Number(idEmpleado)
  );

  let nombreEmpleadoEliminado = empleados[indiceBorrar].nombre;
  empleados.splice(indiceBorrar, 1);
  columnaBorrar.remove();
  actualizarEmpleadosStorage();
  mostrarMensajeConfirmacion(
    `El empleado ${nombreEmpleadoEliminado} fue eliminado exitosamente`,
    "danger"
  );
}

function pintarEmpleados() {
  contenedorEmpleados.innerHTML = "";
  empleados.forEach((empleado) => {
    let column = document.createElement("div");
    column.className = "col-md-4 mt-3";
    column.id = `columna-${empleado.id}`;
    column.innerHTML = `
            <div class="card">
                <div class="card-body">
                <p class="card-text">N° de legajo:
                    <b>${empleado.id}</b>
                </p>
                <p class="card-text">Nombre:
                    <b>${empleado.nombre}</b>
                </p>
                <p class="card-text">Género:
                <b>${empleado.genero}</b>
                </p>
                <p class="card-text">Puesto:
                    <b>${empleado.puesto}</b>
                </p>
                <p class="card-text">Sueldo bruto ($):
                    <b>${empleado.sueldoBruto}</b>
                </p>
                <p class="card-text">Antigüedad (en años):
                    <b>${empleado.anios}</b>
                </p>
                </div>
                <div class="card-footer">
                  <button class="btn btn-danger" id="botonEliminar-${empleado.id}" >Eliminar</button>
                </div>
            </div>`;

    contenedorEmpleados.append(column);

    let botonEliminar = document.getElementById(`botonEliminar-${empleado.id}`);
    botonEliminar.onclick = () => confirmarEliminacion(empleado.id);
  });
}

function actualizarEmpleadosStorage() {
  let empleadosJSON = JSON.stringify(empleados);
  localStorage.setItem("empleados", empleadosJSON);
}

function actualizarUsuarioStorage() {
  localStorage.setItem("usuario", usuario);
}

function obtenerEmpleadosStorage() {
  let empleadosJSON = localStorage.getItem("empleados");
  if (empleadosJSON) {
    empleados = JSON.parse(empleadosJSON);
    pintarEmpleados();
  }
}

/* function consultarEmpleadosServer() {
  fetch("https://64406ed7fadc69b8e06b5a41.mockapi.io/api/l1")
    .then((response) => response.json())
    .then((jsonResponse) => {
      empleados = jsonResponse;
      pintarEmpleados();
    });
}

function crearEmpleadoServer(empleado) {
  fetch("https://64406ed7fadc69b8e06b5a41.mockapi.io/api/l1", {
    method: "POST",
    body: JSON.stringify(empleado),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      mostrarMensajeConfirmacion(
        `El empleado fue agregado exitosamente al legajo`,
        "info"
      );
      console.log(jsonResponse);
      consultarEmpleadosServer()
    });
}
*/
function obtenerUsuarioStorage() {
  let usuarioAlmacenado = localStorage.getItem("usuario");
  if (usuarioAlmacenado) {
    usuario = usuarioAlmacenado;
    mostrarTextoUsuario();
  }
}

function mostrarMensajeConfirmacion(mensaje, clase) {
  Toastify({
    text: mensaje,
    duration: 30000,
    close: true,
    gravity: "top",
    position: "right",
    className: clase
  }).showToast();
}

const DateTime = luxon.DateTime
const now = DateTime.now()
console.log(now.toString())

function main() {
  inicializarElementos();
  inicializarEventos();
  obtenerEmpleadosStorage();
  //consultarEmpleadosServer();//
  obtenerUsuarioStorage();
}

main();
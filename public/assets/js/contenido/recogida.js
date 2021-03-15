let recogida = null
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('id')){
    $.get(`/api/recogida/info/${urlParams.get('id')}`, crearInterfazRecogida);
}
else{
    window.location.replace('../pages/404.html')
}

function crearInterfazRecogida(data){
    recogida = data;

    eliminaPantallaCargando();
    mostrarRecogida();
	crearTarjetas();

    // Crear cables
    $.get(`/api/recogida/${recogida.id}/cable`, crearInterfazCables);
    // Crear ordenadores
    // Crear Transformadores
    // Crear componentes

    // crearInterfazComponentes(ordenador.componentes);
}

function mostrarRecogida(){

	if (recogida.fecha  == null) recogida.fecha = "";

    $("#main-contenido").append(`
		<div id="tabla-recogida" class="w-full overflow-hidden rounded-lg shadow-xs mt-10">

			<div class="w-full overflow-x-auto">
				<table class="w-full whitespace-no-wrap">
					<thead>
						<tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
							<th class="px-4 py-3">ID</th>
							<th class="px-4 py-3">Fecha</th>
							<th class="px-4 py-3">Localización</th>
						</tr>
					</thead>
					<tbody id="body-tabla-recogida" class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
					
                    <tr id="recogida" class=" cursor-pointer ordenador text-gray-700 dark:text-gray-400" onclick="cargarInfoOrdenador(id, this)">
                        <td class="px-4 py-3">
                            <div class="flex items-center text-sm">
                                <svg class="relative hidden w-6 h-6 mr-3 md:block" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p class="font-semibold">${recogida.id}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm">
                            ${recogida.fecha.split('T')[0]}
                        </td>
                        <td class="px-4 py-3 text-sm">
                            ${recogida.localizacion}
                        </td>
                    </tr>
                    
                    </tbody>
				</table>
			</div>
	
		</div>
  `);

}

// -------------------------------------
// Gestión de tarjetas superiores
// -------------------------------------

function tarjeta(tipo,titulo, dato) {
	return `
    <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
			<div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 19 19">
				<path d="M13 7H7v6h6V7z" />
				<path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd" />
				</svg>
			</div>
			<div>
				<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
				${titulo}
				</p>
				<p id="elementos-totales-tarjeta-${tipo}" class="text-lg font-semibold text-gray-700 dark:text-gray-200">
				${dato}
				</p>
			</div>
    </div>
	<div id="boton-aniadir-${tipo}" class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 cursor-pointer" @click="openModal">
			<div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
				<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
			</div>
			<div>
				<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
				Añadir ${tipo}
				</p>
			</div>
    </div>
    `
}

function crearTarjetas() {
	$("#main-contenido").append(`
		<div id="main-tarjetas" class="grid gap-6 mt-4 md:grid-cols-2 xl:grid-cols-4">
		
		</div>
  `)
}

// ----------------------------------------------------------------------------------
// CABLES
// ----------------------------------------------------------------------------------

// Variable de estado para comprobar la página en la que se encuentra
let pagina_cables = 1;
let cables = null;
let numElementosActuales_cables = 0;
let paginaMax_cables = 0;

function fila_cables(id, tipo, version, posicion) {
	if (version == null) version = "";

	return `
		<tr id="cable-${id}" class="cable text-gray-700 dark:text-gray-400">
			<td class="px-4 py-3">
				<div class="flex items-center text-sm">
					<svg class="relative hidden w-6 h-6 mr-3 md:block" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" ><path d="M20 12H4" ></path></svg>
					<div>
						<p class="font-semibold">${id}</p>
					</div>
				</div>
			</td>
			<td id="cable_tipo-${id}" class="px-4 py-3 text-sm">
				${tipo}
			</td>
			<td id="cable_version-${id}" class="px-4 py-3 text-xs">
				${version}
			</td>
			<td class="px-4 py-3">
				<div class="flex items-center space-x-4 text-sm">
					<button id="cable_editar-${id}" @click="openModal" onclick="cargarFormularioCable('${id}', '${tipo}', '${version}', ${posicion})" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Edit">
						<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
							<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
						</svg>
					</button>
					<button onclick="eliminarCable(${id}, ${posicion});" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">
						<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
						</svg>
					</button>
				</div>
			</td>
		</tr>
  `;
}

function crearCables() {
	let filas = '';
	let elementos = cables.data.slice((pagina_cables - 1) * 10, (pagina_cables - 1) * 10 + 10);
	paginaMax_cables = Math.ceil(cables.cantidad/10);

	// Elimina la tabla de cables
	$('.cable').remove();

	for (i = 0; i < elementos.length; i++)
		filas += fila_cables(elementos[i].id, elementos[i].tipo, elementos[i].version_tipo, (pagina_cables - 1)*10+i );

	$("#body-tabla-cables").append(filas);

	// Actualiza el pie de la tabla
	if(numElementosActuales_cables){
		numElementosActuales_cables = elementos.length;
		$('#cantidad-pie_cables').html(`Mostrando ${numElementosActuales_cables} de ${cables.cantidad}`);
	}
	else
		numElementosActuales_cables = elementos.length;

	generarNavegadorTablaCables();
}

function crearTablaCables() {

	$("#cables-contenido").append(`
		<div id="main-tabla-cables" class="w-full overflow-hidden rounded-lg shadow-xs">

			<div class="w-full overflow-x-auto">
				<table class="w-full whitespace-no-wrap">
					<thead>
						<tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
							<th class="px-4 py-3">ID</th>
							<th class="px-4 py-3">Tipo</th>
							<th class="px-4 py-3">Versión</th>
							<th class="px-4 py-3">Acciones</th>
						</tr>
					</thead>
					<tbody id="body-tabla-cables" class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
					</tbody>
				</table>
			</div>
	
		</div>
  `);

	crearCables();
}

function crearInterfazCables(data) {
	cables = data;
	paginaMax_cables = Math.ceil(data.cantidad/10);

	$('#cargando-cables').remove();
	$('#main-tarjetas').append(tarjeta('cables', 'Total de cables', cables.cantidad));
	$('#boton-aniadir-cables').attr("onclick","cargarFormularioVacioCable()"); 
	if (cables.cantidad) {
		crearTablaCables();
		generarPieCables();
	}
}

function getPaginaCables(num) {
	pagina_cables = num;
	crearCables();
}

function generarNavegadorTablaCables(){
	let html = "";

	// Elimina los actuales al cambiar de tabla
	$('.elemento-navegacion-tabla_cables').remove();

	html += `
		<li class="elemento-navegacion-tabla_cables">
			<button onclick="if(pagina_cables>1) getPaginaCables(pagina_cables-1);" class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
				<svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
					<path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
				</svg>
			</button>
		</li>
	`;

	if(paginaMax_cables > 5){

		if(pagina_cables != 1){
			html += `<li class="elemento-navegacion-tabla_cables"> 
						<button onclick="getPaginaCables(1);" class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
							1 
						</button>
					</li>
					`
		}

		if(pagina_cables >= 3){
			html += `<li class="elemento-navegacion-tabla_cables">
						<span class="px-3 py-1">...</span>
					</li>
					`
		}

		html += `<li class="elemento-navegacion-tabla_cables">
					<button onclick="getPaginaCables(${pagina_cables});" class="px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple">
						${pagina_cables}
					</button>
				</li>
				`

		if(pagina_cables != paginaMax_cables){
			if(pagina_cables<paginaMax_cables-1){
				html += `<li class="elemento-navegacion-tabla_cables">
							<span class="px-3 py-1">...</span> 
						</li>
						`
			}

			html += `
				<li class="elemento-navegacion-tabla_cables">
					<button onclick="getPaginaCables(${paginaMax_cables});" class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
						${paginaMax_cables}
					</button>
				</li>
			`
		}
	}
	else{

		for (i = 1; i <= paginaMax_cables; i++) {
			html += `
				<li class="elemento-navegacion-tabla_cables">
					<button onclick="getPaginaCables(${i});" 
						${ pagina_cables!=i ? 'class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"' : 'class="px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple"' } >
						${i}
					</button>
				</li>
			`
		}

	}

	html += `
		<li class="elemento-navegacion-tabla_cables">
			<button onclick="if(pagina_cables<paginaMax_cables) getPaginaCables(pagina_cables+1);" class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
				<svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
					<path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
				</svg>
			</button>
		</li>
	`;
	
	$('#navegacion-tablas_cables').html(html);
}

function generarPieCables() {
	$('#pie-tabla_cables').remove();

	$("#main-tabla-cables").append(`
		<div id="pie-tabla_cables" class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
			<span id="cantidad-pie_cables" class="flex items-center col-span-3">
				Mostrando ${numElementosActuales_cables} de ${cables.data.length}
			</span>
			<span class="col-span-2"></span>
			<!-- Pagination -->
			<span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
				<nav aria-label="Table navigation">
					<ul id="navegacion-tablas_cables" class="inline-flex items-center">
					</ul>
				</nav>
			</span>
		</div>
	  `);
	  
	  generarNavegadorTablaCables();
}

function eliminarCable(id, posicion){
	$.ajax({
		url: `/api/cable/id/${id}`,
		type: 'DELETE',
		success: function(){
			cables.cantidad--;
			
			if(cables.cantidad%10 == 0 && pagina_cables!=1){
				pagina_cables--;
			}

			cables.data.splice(posicion,1);
			crearCables();
			generarPieCables();

			// Actualiza la tarjeta superior
			$('#elementos-totales-tarjeta-cables').html(cables.data.length);
		},
		error: function(){
			$('#titulo-error').html('Error al eliminar')
			$('#mensaje-error').html('Ha ocurrido un error al eliminar el cable')
			$('.popup').removeClass('hidden');

			setTimeout(() => $('.popup').addClass('hidden'), 3000 )
		}
	});
}

function cargarFormularioCable(id, tipo, version, posicion){

	$('#body-modal').html(`
	
	<p
		class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
	>
		Editar cable
	</p>
	<!-- Modal description -->
	<div class="text-sm mt-5">
		<label class="block text-sm my-3">
		<span class="text-gray-700 dark:text-gray-400">Tipo</span>
		<input id="editar-tipo"
			class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
			placeholder=""
		/>
		</label>

		<label class="block text-sm my-3">
		<span class="text-gray-700 dark:text-gray-400">Versión</span>
		<input id="editar-version"
			class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
			placeholder=""
		/>
		</label>
	</div>

	`)

	$('#editar-tipo').val(tipo);
	$('#editar-version').val(version);
	$('#confirmar-modal').attr('onclick', `editarCable(${id}, ${posicion})`);

}

function cargarFormularioVacioCable(){

	$('#body-modal').html(`
	
	<p
		class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
	>
		Editar cable
	</p>
	<!-- Modal description -->
	<div class="text-sm mt-5">
		<label class="block text-sm my-3">
		<span class="text-gray-700 dark:text-gray-400">Tipo</span>
		<input id="editar-tipo"
			class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
			placeholder=""
		/>
		</label>

		<label class="block text-sm my-3">
		<span class="text-gray-700 dark:text-gray-400">Versión</span>
		<input id="editar-version"
			class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
			placeholder=""
		/>
		</label>
	</div>

	`)

	$('#editar-tipo').val('');
	$('#editar-version').val('');
	$('#confirmar-modal').attr('onclick', `crearCable()`);
}

function editarCable(id, posicion){

	let tipo 	= $('#editar-tipo').val();
	let version = $('#editar-version').val();
	
	$.ajax({
		url: `/api/cable/${id}/${tipo}/${version}`,
		type: 'PUT',
		success: function(){
			$(`#cable_tipo-${id}`).html(tipo);
			$(`#cable_version-${id}`).html(version);
			$(`#cable_editar-${id}`).attr('onclick', `cargarFormularioCable('${id}', '${tipo}', '${version}', ${posicion})`);

			cables.data[posicion].tipo = tipo;
			cables.data[posicion].version_tipo = version;
		},
		error: function(){
			$('#titulo-error').html('Error al editar el cable')
			$('#mensaje-error').html('Ha ocurrido un error al eliminar el cable')
			$('.popup').removeClass('hidden');

			setTimeout(() => $('.popup').addClass('hidden'), 3000 )
		}
	});

}

function crearCable(){

	let tipo 	= $('#editar-tipo').val();
	let version = $('#editar-version').val();
	
	$.ajax({
		url: `/api/recogida/${recogida.id}/cable/${tipo}/${version}`,
		type: 'POST',
		success: function(data){
			let id = data.id;
			cables.cantidad++;

			cables.data.push({
				id: id,
				tipo: tipo,
				version_tipo: version
			})

			$('#elementos-totales-tarjeta-cables').html(cables.cantidad);

			if(!$('#main-tabla-cables').length){
				crearTablaCables();
				generarPieCables();
			}
			else
				crearCables();
		},
		error: function(){
			$('#titulo-error').html('Error al crear el cable')
			$('#mensaje-error').html('Ha ocurrido un error al crear el cable')
			$('.popup').removeClass('hidden');

			setTimeout(() => $('.popup').addClass('hidden'), 3000 );
		}
	});

}
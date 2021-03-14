const express 	  = require('express'),
	  router  	  = express.Router();
const db 	  	  = require('../db/pool').pool;
const controlador = require('../controllers/recogida');
const { body } = require('express-validator');

// Obtiene todas las recogidas por tipo
router.get	  ('/:tipo',                controlador.obtenerRecogida);

// Obtiene todas las recogidas por tipo
router.get	  ('/info/:id', 			controlador.obtenerRecogidaId);

// Obtiene los cables de una recogida
router.get	  ('/:id/cable',            controlador.obtenerCables);

// Obtiene los transformadores de una recogida
router.get	  ('/:id/transformador',    controlador.obtenerTransformadores);

// Obtiene los ordenadores de una recogida
router.get	  ('/:id/ordenador',        controlador.obtenerOrdenadores);

// Obtiene los componentes de una recogida
router.get	  ('/:id/componente',       controlador.obtenerComponentes);

// Crea una nueva recogida
router.post	  ('/',[
	body('fecha').matches(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/).withMessage('Fecha mal introducida. Formatos de fecha correcto: AAAA-MM-DD'),
	body('tipo').isIn(['Entrega', 'Recogida']).withMessage('Tipo no válido. Tiene que estar entre los siguientes valores: Entrega, Recogida'),
	body('localizacion').isString().withMessage('Localizacion no válida. No puede ser vacía y tiene que ser un string')
],                                      controlador.nuevaRecogida);

// Añade un cable a una recogida
router.post	  ('/:id_recogida/cable/:id_cable', controlador.aniadirCable);

// Añade un transformador a una recogida
router.post	  ('/:id_recogida/transformador/:id_trans', controlador.aniadirTransformador);

// Añade un ordenador a una recogida
router.post	  ('/:id_recogida/ordenador/:id_ord', controlador.aniadirOrdenador);

// Añade un componente a una recogida
router.post	  ('/:id_recogida/componente/:id_comp', controlador.aniadirComponente);

// Edita una recogida
router.put	  ('/:id',[
	body('fecha').matches(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/).withMessage('Fecha mal introducida. Formatos de fecha correcto: AAAA-MM-DD'),
	body('localizacion').isString().withMessage('Localizacion no válida. No puede ser vacía y tiene que ser un string')
],                                      controlador.editarRecogida);

// Elimina una recogida
router.delete ('/:id', 					controlador.eliminarRecogida)

module.exports = router;
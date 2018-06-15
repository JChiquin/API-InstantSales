const mongoose = require('mongoose'),
	config = require('./config'),
	app = require('./app');



mongoose.connect(config.db,(err,res) => {
	if(err)
		return console.log(`Error en la conexión con la BD: ${err}`);
	console.log("Conexión con la BD establecida");

	app.listen(config.port, () => {
	  console.log(`API escuchando en https://localhost:${config.port}`);
	});
})
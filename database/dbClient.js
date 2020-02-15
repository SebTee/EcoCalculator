const {Pool} = require('pg');

const pool = new Pool({
	host: 'localhost',
	user: 'ecocalculator',
	password: 'ecocalculator',
	database: 'ecocalculator',
	port: '5432'
});

/*pool.connect((err, client, release) => {
	if (err) {
		return console.error('Error connecting to database ecocalculator', err.stack)
	}
});*/

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1)
});

module.exports = pool;
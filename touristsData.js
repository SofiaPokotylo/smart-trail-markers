const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '2427',
  port: 5432,
});

const getTouristData = (body) => {
  return new Promise(function(resolve, reject) {
    const { date, time } = body
    pool.query(
      'SELECT "WIND_SPEED", "WIND_DIRECTION", "TEMPERATURE", "HUMIDITY", "PRESSURE", "RAINFALL", "CLOUDINESS", "IMPULSES" FROM "ENVIRONMENT" WHERE "date" = $1 AND "time" = $2',
      [date, time],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.rows.length > 0) {
          const touristData = results.rows[0];
          resolve(weatherData);
        } else {
          resolve(null); // Return null if no weather data found within the specified range
        }
      }
    );
  });
};


module.exports = {
  getWeatherData,
}
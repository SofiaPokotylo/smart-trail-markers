const STMdb = require('pg').Pool
const stmdb = new STMdb({
  user: 'postgres',
  host: 'localhost',
  database: 'Smart Trail Markers',
  password: '2427',
  port: 5432,
});

const getLastValues = () => {
  return new Promise(function(resolve, reject) {
    stmdb.query(
      'SELECT TO_CHAR("date", \'YYYY-MM-DD\') AS "date", "time" FROM "ENVIRONMENT" ORDER BY "date" DESC, "time" DESC', (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.rows.length > 0) {
          const values = results.rows[0];
          resolve(values);
        } else {
          resolve(null);
        }
      }
    );
  });
};

const getWeatherData = (body) => {
  return new Promise(function(resolve, reject) {
        const { date, time } = body;
    stmdb.query(
      'SELECT "WIND_SPEED", "WIND_DIRECTION", "TEMPERATURE", "HUMIDITY", "PRESSURE", "RAINFALL", "CLOUDINESS", "IMPULSES" FROM "ENVIRONMENT" WHERE "date" = $1 AND "time" >= $2',
      [date, time],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.rows.length > 0) {
          const weatherData = results.rows[0];
          resolve(weatherData);
        } else {
          resolve(null);
        }
      }
    );
  });
};

const getTouristData = (body) => {
  return new Promise(function(resolve, reject) {
    const { date } = body;
    stmdb.query(
      'SELECT "TOURISTS_NUM_DIRECT", "TOURISTS_NUM_REVERSE" FROM "ATTENDANCE" WHERE "date" = $1',
      [date],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.rows.length > 0) {
          const touristData = results.rows[0];
          resolve(touristData);
        } else {
          resolve(null); 
        }
      }
    );
  });
};

const getTrail = (body) => {
  return new Promise(function(resolve, reject) {
        const { num } = body;
    stmdb.query(
      'SELECT "COMPLEXITY", "LENGTH", "DURATION" FROM "TRAILS" WHERE "ROUTE_NUM" = $1',
      [ num ],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.rows.length > 0) {
          const trailData = results.rows[0];
          resolve(trailData);
        } else {
          resolve(null); 
        }
      }
    );
  });
};


const getMarkers = (body) => {
  return new Promise(function(resolve, reject) {
        const { route } = body;
    stmdb.query(
      'SELECT "MARKER_ID", "type", "STATUS" FROM "MARKERS" WHERE "TRAILS_ROUTE_NUM" = $1',
      [ route ],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.rows.length > 0) {
          const markerData = results;
          resolve(markerData);
        } else {
          resolve(null); 
        }
      }
    );
  });
};


module.exports = {
  getLastValues,
  getWeatherData,
  getTouristData,
  getTrail,
  getMarkers,
}
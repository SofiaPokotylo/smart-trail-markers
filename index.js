const express = require('express')
const app = express()
const port = 3001


const { Client } = require('pg');
const connectionString = 'postgresql://postgres:2427@localhost:5432/Smart Trail Markers'; 
const client = new Client({
  connectionString: connectionString,
});
client.connect();

const values = require('./weatherData')
const weatherData = require('./weatherData')
const touristData = require('./weatherData')
const trailData = require('./weatherData')
const markerData = require('./weatherData')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

//отримання даних з бази даних

app.post('/last-values', (req, res) => { 
  values.getLastValues()
    .then(values => {
      if (values !== null) {
        res.status(200).json(values);
      } else {
        res.status(404).json({ error: 'No weather data found for the specified date and time.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
});

app.post('/weather-data', (req, res) => {
  weatherData.getWeatherData(req.body)
    .then(weatherData => {
      if (weatherData !== null) {
        res.status(200).json(weatherData);
      } else {
        res.status(404).json({ error: 'No weather data found for the specified date and time.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
});

app.post('/tourist-data', (req, res) => {
  touristData.getTouristData(req.body)
    .then(touristData => {
      if (touristData !== null) {
        res.status(200).json(touristData);
      } else {
        res.status(404).json({ error: 'No tourist data found for the specified date and time.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
});

app.post('/trail-data', (req, res) => {
  trailData.getTrail(req.body)
    .then(trailData => {
      if (trailData !== null) {
        res.status(200).json(trailData);
      } else {
        res.status(404).json({ error: 'No trail data found for the specified date and time.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
});

app.post('/markers-data', (req, res) => {
  markerData.getMarkers(req.body)
    .then(markerData => {
      if (markerData !== null) {
        res.status(200).json(markerData);
      } else {
        res.status(404).json({ error: 'No trail data found for the specified date and time.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
});

const mqtt = require("mqtt");
const { Pool } = require("pg");
const client1 = mqtt.connect("mqtt://broker.hivemq.com");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Smart Trail Markers',
  password: '2427',
  port: 5432,
});

client1.on("connect", () => { //під'єднання до MQTT брокера
  client1.subscribe("cupcarbon/marker", (err) => {
    if (!err) {
      console.log("Connected!");
    }
  });
});

let t = 0;   // котра година
//let t_test = 0;
let t1 = 0;  // перший маркер за цю годину
let t2 = 0;  // другий маркер за цю годину
let tm = 0;

let processing = false;

client1.on("message", async (topic, message) => { //перед обробкою наступного повідомлення повинна бути завершена обробка попереднього
  if (!processing) {
    processing = true; 
    await processaMessage(topic, message); 
    processing = false;

    setTimeout(() => {
      processing = false; 
    }, 10);
  }
});

function getImpulseDescription(impulses) { //перетворення значень з датчика в текстову інформацію
  if (impulses >= 0 && impulses < 1) {
    return "Відсутні";
  } else if (impulses >= 1 && impulses < 3) {
    return "Слабкі";
  } else if (impulses >= 3 && impulses < 5) {
    return "Помірні";
  } else if (impulses >= 5 && impulses < 7) {
    return "Середні";
  } else {
    return "Сильні";
  }
}

function getCloudinessDescription(cloudiness) {
  if (cloudiness >= 0 && cloudiness < 2) {
    return "Хмарно";
  } else if (cloudiness >= 2 && cloudiness < 5) {
    return "Прояснення";
  } else if (cloudiness >= 5 && cloudiness < 7) {
    return "Чисте небо";
  } else {
    return "Сонячно";
  }
}

function getWindDirectionDescription(w) { //перетворення градусу вітру в напрямок
  if (w <= 11 || w >= 349) {
    return "N";
  } else if (w > 11 && w < 34) {
    return "NNE";
  } else if (w >= 34 && w <= 56) {
    return "NE";
  } else if (w > 56 && w < 79) {
    return "ENE";
  } else if (w >= 79 && w <= 101) {
    return "E";
  } else if (w > 101 && w < 124) {
    return "ESE";
  } else if (w >= 124 && w <= 146) {
    return "SE";
  } else if (w > 146 && w < 169) {
    return "SSE";
  } else if (w >= 169 && w <= 191) {
    return "S";
  } else if (w > 191 && w < 214) {
    return "SSW";
  } else if (w >= 214 && w <= 236) {
    return "SW";
  } else if (w > 236 && w < 259) {
    return "WSW";
  } else if (w >= 259 && w <= 281) {
    return "W";
  } else if (w > 281 && w < 304) {
    return "WNW";
  } else if (w >= 304 && w <= 326) {
    return "NW";
  } else {
    return "NNW";
  }
}

async function insertEnvironmentData(client, dataId, currentTime, queries) { // вставлення погодних даних в таблицю
  for (const { value, sensorId } of queries) {
    await client.query(`
      INSERT INTO "ENVIRONMENT_DATA" ("DATA_ID", "date", "time", "VALUE1", "SENSORS_SENSOR_ID")
      VALUES ($1, CURRENT_DATE, $2, $3, $4)
    `, [dataId + 1, currentTime, value, sensorId]);
  }
  console.log("Records inserted into ENVIRONMENT_DATA successfully");
}


async function updateEnvironment(client, trailId) { // вставлення погодних даних в таблицю (для всієї стежки, відбувається раз в годину)
  await client.query(`
    DELETE FROM "ENVIRONMENT"
    WHERE "REPORT_ID" = ( SELECT "REPORT_ID" FROM "ENVIRONMENT" ORDER BY "date" DESC, "REPORT_ID" DESC LIMIT 1)
    AND "date" =  ( SELECT "date" FROM "ENVIRONMENT" ORDER BY "date" DESC LIMIT 1)
  `);

  console.log("Record deleted from ENVIRONMENT successfully");

  const result = await client.query(
    'SELECT MAX("REPORT_ID") FROM "ENVIRONMENT" WHERE "date" = CURRENT_DATE'
  );
  const reportId = result.rows[0].max || 0;

  await client.query(`
    INSERT INTO "ENVIRONMENT" ("REPORT_ID", "WIND_SPEED", "WIND_DIRECTION", "TEMPERATURE", "HUMIDITY", "PRESSURE", "date", "time", "RAINFALL", "CLOUDINESS", "IMPULSES", "TRAILS_ROUTE_NUM")
    SELECT
      $1 AS REPORT_ID,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'WS%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS WIND_SPEED,
      MIN(CASE WHEN s."SENSOR_ID" LIKE 'WD%' THEN ed."VALUE1" ELSE NULL END) AS WIND_DIRECTION,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'TS%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS TEMPERATURE,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'HS%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS HUMIDITY,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'AP%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS PRESSURE,
      (SELECT "date" FROM "ENVIRONMENT_DATA" ORDER BY "date" DESC LIMIT 1) AS date,
      ed."time" AS time,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'RF%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS RAINFALL,
      MAX(CASE WHEN s."SENSOR_ID" LIKE 'CL%' THEN ed."VALUE1" ELSE NULL END) AS CLOUDINESS,
      MIN(CASE WHEN s."SENSOR_ID" LIKE 'IS%' THEN ed."VALUE1" ELSE NULL END) AS IMPULSES,
      $2 AS TRAILS_ROUTE_NUM
    FROM "ENVIRONMENT_DATA" ed
    JOIN "SENSORS" s ON ed."SENSORS_SENSOR_ID" = s."SENSOR_ID"
    JOIN "MARKERS" m ON s."MARKERS_MARKER_ID" = m."MARKER_ID"
    WHERE ed."date" = (SELECT "date" FROM "ENVIRONMENT_DATA" ORDER BY "date" DESC LIMIT 1)
    AND ed."time" >= DATE_TRUNC('hour',(SELECT "time" FROM "ENVIRONMENT_DATA" ORDER BY "date" DESC, "time" DESC LIMIT 1))
  `, [reportId + 1, trailId]);
  console.log("Records inserted into ENVIRONMENT successfully");
}

async function insertTemporaryEnvironmentData(client, currentTime, trailId) { // вставлення даних в таблицю після отримання даних з 2 перших маркерів
  const result = await client.query(
    'SELECT MAX("REPORT_ID") FROM "ENVIRONMENT" WHERE "date" = CURRENT_DATE'
  );
  const reportId = result.rows[0].max || 0;
  await client.query(`
    INSERT INTO "ENVIRONMENT" ("REPORT_ID", "WIND_SPEED", "WIND_DIRECTION", "TEMPERATURE", "HUMIDITY", "PRESSURE", "date", "time", "RAINFALL", "CLOUDINESS", "IMPULSES", "TRAILS_ROUTE_NUM")
    SELECT
      $1 AS REPORT_ID,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'WS%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS WIND_SPEED,
      MIN(CASE WHEN s."SENSOR_ID" LIKE 'WD%' THEN ed."VALUE1" ELSE NULL END) AS WIND_DIRECTION,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'TS%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS TEMPERATURE,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'HS%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS HUMIDITY,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'AP%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS PRESSURE,
      (SELECT "date" FROM "ENVIRONMENT_DATA" ORDER BY "date" DESC LIMIT 1) AS date,
      $2 AS time,
      ROUND(AVG(CASE WHEN s."SENSOR_ID" LIKE 'RF%' THEN ed."VALUE1"::NUMERIC ELSE NULL END),1) AS RAINFALL,
      MAX(CASE WHEN s."SENSOR_ID" LIKE 'CL%' THEN ed."VALUE1" ELSE NULL END) AS CLOUDINESS,
      MIN(CASE WHEN s."SENSOR_ID" LIKE 'IS%' THEN ed."VALUE1" ELSE NULL END) AS IMPULSES,
      $3 AS TRAILS_ROUTE_NUM
    FROM "ENVIRONMENT_DATA" ed
    JOIN "SENSORS" s ON ed."SENSORS_SENSOR_ID" = s."SENSOR_ID"
    JOIN "MARKERS" m ON s."MARKERS_MARKER_ID" = m."MARKER_ID"
    WHERE ed."date" = (SELECT "date" FROM "ENVIRONMENT_DATA" ORDER BY "date" DESC LIMIT 1)
    AND ed."time" >= DATE_TRUNC('hour',(SELECT "time" FROM "ENVIRONMENT_DATA" ORDER BY "date" DESC, "time" DESC LIMIT 1))
  `, [reportId + 1, currentTime, trailId]);
  console.log("Records inserted into ENVIRONMENT successfully"); 
}


async function insertTouristData(client, trailId, markerId, sensorId, direction, num, currentTime) { //додавання даних про проходження туристів
  const result = await client.query('SELECT MAX("RECORD_ID") FROM "TOURIST_DATA" WHERE "date" = CURRENT_DATE');
  const recordId = result.rows[0].max || 0;

  await client.query(`
    INSERT INTO "TOURIST_DATA" ("RECORD_ID", "date", "time", "DIRECTION", "SENSORS_SENSOR_ID", "TOURISTS_NUM")
    VALUES ($1, CURRENT_DATE, $2, $3, $4, $5)
  `, [recordId + 1, currentTime, direction, `IR${trailId}0${markerId}0${sensorId}`, num]);

  console.log("Record inserted into TOURIST_DATA successfully");
}

async function insertTouristsData(client, tm) { // підрахунок загальної кількості туристів, які пройшли повз маркер 
  const result = await client.query('SELECT MAX("RECORD_ID") FROM "TOURISTS"');
  const recordId = result.rows[0].max || 0;

  await client.query(`
    INSERT INTO "TOURISTS" ("RECORD_ID", "TOURISTS_NUM_DIRECT", "TOURISTS_NUM_REVERSE", "date", "MARKERS_MARKER_ID")
      SELECT $1 AS RECORD_ID, 
             COALESCE(td_D.total_tourists, 0) AS TOURISTS_NUM_DIRECT, 
             COALESCE(td_R.total_tourists_R, 0) AS TOURISTS_NUM_REVERSE, 
             COALESCE(td_D."date", td_R."date") AS date, 
             m."MARKER_ID" AS MARKERS_MARKER_ID
      FROM (
        SELECT "date", "SENSORS_SENSOR_ID", SUM("TOURISTS_NUM") AS total_tourists
        FROM "TOURIST_DATA"
        WHERE "DIRECTION" = 'Прямий' AND "date" = (SELECT "date" FROM "TOURIST_DATA" ORDER BY "date" DESC LIMIT 1)
        GROUP BY "date", "SENSORS_SENSOR_ID"
      ) td_D
      FULL OUTER JOIN (
        SELECT "date", "SENSORS_SENSOR_ID", SUM("TOURISTS_NUM") AS total_tourists_R
        FROM "TOURIST_DATA"
        WHERE "DIRECTION" = 'Зворотній' AND "date" = (SELECT "date" FROM "TOURIST_DATA" ORDER BY "date" DESC LIMIT 1)
        GROUP BY "date", "SENSORS_SENSOR_ID"
      ) td_R ON td_D."date" = td_R."date" AND td_D."SENSORS_SENSOR_ID" = td_R."SENSORS_SENSOR_ID"
      JOIN "SENSORS" s ON s."SENSOR_ID" = COALESCE(td_D."SENSORS_SENSOR_ID", td_R."SENSORS_SENSOR_ID")
      JOIN "MARKERS" m ON m."MARKER_ID" = s."MARKERS_MARKER_ID"
      ORDER BY td_R."date", m."MARKER_ID";
  `, [recordId + 1]);

  console.log("Records inserted into TOURISTS successfully");
}


async function insertAttendanceData(client) { //підрахунок загальної кількості туристів, які подолали маршрут в прямому/зворотному напрямку
  const result = await client.query('SELECT MAX("RECORD_NUM") FROM "ATTENDANCE"');
  const recordNum = result.rows[0].max || 0;

  await client.query(`
    INSERT INTO "ATTENDANCE" ("RECORD_NUM", "date", "TOURISTS_NUM_DIRECT", "TOURISTS_NUM_REVERSE", "TRAILS_ROUTE_NUM")
    SELECT $1 AS "RECORD_NUM", td_D."date", 
           CASE WHEN n."NUM_MARKERS" < n."MARKERS_NUM" THEN 0 ELSE MIN(total_tourists_D) END AS "TOURISTS_NUM_DIRECT",  
           CASE WHEN p."NUM_MARKERS" < p."MARKERS_NUM" THEN 0 ELSE MIN(total_tourists_R) END AS "TOURISTS_NUM_REVERSE", m."TRAILS_ROUTE_NUM"
    FROM (
        SELECT "SENSORS_SENSOR_ID", "date", SUM("TOURISTS_NUM") AS total_tourists_D
        FROM "TOURIST_DATA" 
        WHERE "DIRECTION" = 'Прямий'
        AND "date" = (SELECT "date" FROM "TOURIST_DATA" ORDER BY "date" DESC LIMIT 1)
        GROUP BY "SENSORS_SENSOR_ID", "date"
    ) td_D
    JOIN (
        SELECT "SENSORS_SENSOR_ID", "date", SUM("TOURISTS_NUM") AS total_tourists_R
        FROM "TOURIST_DATA"
        WHERE "DIRECTION" = 'Зворотній'
        AND "date" = (SELECT "date" FROM "TOURIST_DATA" ORDER BY "date" DESC LIMIT 1)
        GROUP BY "SENSORS_SENSOR_ID", "date"
    ) td_R ON td_R."SENSORS_SENSOR_ID" = td_D."SENSORS_SENSOR_ID" AND td_R."date" = td_D."date"
    JOIN "SENSORS" s ON s."SENSOR_ID" = COALESCE(td_D."SENSORS_SENSOR_ID", td_R."SENSORS_SENSOR_ID")
    JOIN "MARKERS" m ON m."MARKER_ID" = s."MARKERS_MARKER_ID"
    JOIN "TRAILS" t ON t."ROUTE_NUM" = m."TRAILS_ROUTE_NUM"
    JOIN (
        SELECT t."MARKERS_NUM", t."ROUTE_NUM", td."date", "DIRECTION", COUNT(DISTINCT m."MARKER_ID") AS "NUM_MARKERS"
        FROM "TOURIST_DATA" td
        JOIN "SENSORS" s ON s."SENSOR_ID" = td."SENSORS_SENSOR_ID"
        JOIN "MARKERS" m ON m."MARKER_ID" = s."MARKERS_MARKER_ID"
        JOIN "TRAILS" t ON t."ROUTE_NUM" = m."TRAILS_ROUTE_NUM"
        WHERE td."DIRECTION" = 'Прямий' AND td."date" = (SELECT "date" FROM "TOURIST_DATA" ORDER BY "date" DESC LIMIT 1)
        GROUP BY td."date", "DIRECTION", t."ROUTE_NUM", t."MARKERS_NUM"
        ORDER BY td."date", "DIRECTION"
    ) n ON n."date" = td_D."date"
    JOIN (
        SELECT t."MARKERS_NUM", t."ROUTE_NUM", td."date", "DIRECTION", COUNT(DISTINCT m."MARKER_ID") AS "NUM_MARKERS"
        FROM "TOURIST_DATA" td
        JOIN "SENSORS" s ON s."SENSOR_ID" = td."SENSORS_SENSOR_ID"
        JOIN "MARKERS" m ON m."MARKER_ID" = s."MARKERS_MARKER_ID"
        JOIN "TRAILS" t ON t."ROUTE_NUM" = m."TRAILS_ROUTE_NUM"
        WHERE td."DIRECTION" = 'Зворотній' AND td."date" = (SELECT "date" FROM "TOURIST_DATA" ORDER BY "date" DESC LIMIT 1)
        GROUP BY td."date", "DIRECTION", t."ROUTE_NUM", t."MARKERS_NUM"
        ORDER BY td."date", "DIRECTION"
    ) p ON p."date" = td_D."date"
    GROUP BY m."TRAILS_ROUTE_NUM", td_D."date", n."MARKERS_NUM", n."NUM_MARKERS", p."MARKERS_NUM", p."NUM_MARKERS";
  `, [recordNum + 1]);

  console.log("Records inserted into ATTENDANCE successfully");
}

function createWarningDescription(jsonData) { //створення опису попередження залежно від типу повідомлення
  let warn_type = "";
  let descr = "";
  if(jsonData.type === 6){
    warn_type = "Button";
  } else {
    warn_type = "Conditions";
  }
  switch (jsonData.type) {
    case 6:
      console.log("SOS button was pressed");
      descr = `SOS button was pressed on Marker ${jsonData["marker-id"]} on Trail ${jsonData["trail-id"]}`;
      break;
    case 1:
      descr = `Temperature: ${jsonData.value}`;
      break;
    case 2:
      descr = `Rainfall: ${jsonData.value}`;
      break;
    case 3:
      descr = `Strong wind: ${jsonData.value}`;
      break;
    case 4:
      descr = `Impulses: ${jsonData.value}`;
      break;
  }
  return { warn_type, descr };
}

async function insertWarningData(client, type, currentTime, warn_type, descr, trailId, markerId, sensorId) { 
  const sensorPrefixMap = {
    1: "TS", // температура
    2: "RF", // опади
    3: "WS", // швидкість вітру
    4: "IS", // поштовхи землі
  };

  const markerIdFormatted = `OG${trailId}0${markerId}`;
  const sensorIdFormatted = sensorPrefixMap[type] ? `${sensorPrefixMap[type]}${trailId}0${markerId}0${sensorId}` : null;

  const queryParams = [currentTime, warn_type, descr, markerIdFormatted];
  if (sensorIdFormatted) {
    queryParams.push(sensorIdFormatted);
  }

  const query = `
    WITH max_record_num AS (
      SELECT COALESCE(MAX("RECORD_NUM"), 0) + 1 AS max_record_num
      FROM "WARNINGS"
      WHERE "date" = CURRENT_DATE
    )
    INSERT INTO "WARNINGS" ("RECORD_NUM", "date", "time", "WARNING_TYPE", "DESCRIPTION", "MARKERS_MARKER_ID" ${sensorIdFormatted ? ', "SENSORS_SENSOR_ID"' : ''})
    SELECT max_record_num, CURRENT_DATE, $1, $2, $3, $4 ${sensorIdFormatted ? ', $5' : ''}
    FROM max_record_num
  `;

  await client.query(query, queryParams);

  console.log("Record inserted into WARNINGS successfully");
}

function updateBannerMarkers(trailId, markerId) { //створення нових банерів-попереджень
  let k = 0;
  const tmess = `OG${trailId}0${markerId}`;
  for (let q = 1; q < banners.length; q++) {
    const banner1 = banners[q];
    if (banner1.marker.includes(tmess)) {
      k = 1;
      break;
    }
  }
  if (k === 0) {
    let bannerCopy = { ...banner };
    bannerCopy.marker = `OG${trailId}0${markerId}`;
    banners.push(bannerCopy);
  }
}

function handleTemperatureLogic(trailId, markerId, sensorId, temp, set) {
  const getTypeTitle = banners[0].type;
  let mtitle = "";

  if (set === 1) {
    if (temp > 35 || temp < -25) { //екстремальні значення температури, налаштовується загальний банер для екстримальних явищ
      mtitle = ext_t;
      if (getTypeTitle !== "extreme") {
        banners[0].type = "extreme";
        banners[0].title2 = null;
        banners[0].title = ext_t;
      }
    } else if (temp >= 27 || temp <= -15) { //критичні значення, налаштовується банер-попередження про температуру
      mtitle = temp > 0 ? temp_h_t : temp_c_t;
      if (getTypeTitle === "usual") {
        banners[0].type = "env";
        banners[0].title2 = "1";
        banners[0].title = null;
        banners[0].temp = mtitle;
      } else if (banners[0].temp === null) {
        banners[0].temp = mtitle;
      }
    }

    updateBannerSensor(trailId, markerId, sensorId, temp, "temp", mtitle);

  } else {
    resetBannerValues(trailId, markerId, temp, "temp");

    if (temp >= 27 || temp <= -15) {
      mtitle = temp > 0 ? temp_h_t : temp_c_t;
      updateBannerTypeToEnv();
      banners[0].temp = mtitle;
    } else {
      clearBannerValues(trailId, markerId, "temp");
      resetBannerTypeIfNeeded();
    }
  }
}

function updateBannerSensor(trailId, markerId, sensorId, temp, sensorType, mtitle) { //налаштування банерів
  const tmess = `OG${trailId}0${markerId}`;
  const sensorPrefixes = {
    rain: 'RF',
    wind: 'WS',
    temp: 'TS',
    imp: 'IS' 
  };
  const sensorProps = {
    rain: 'r_sensor',
    wind: 'w_sensor',
    temp: 't_sensor',
    imp: 'i_sensor' 
  };
  const valueProps = {
    rain: 'r_val',
    wind: 'w_val',
    temp: 't_val',
    imp: 'i_val' 
  };

  for (let q = 1; q < banners.length; q++) {
    const banner1 = banners[q];
    if (banner1.marker.includes(tmess)) {
      const sensorPrefix = sensorPrefixes[sensorType];
      const sensorProp = sensorProps[sensorType];
      const valueProp = valueProps[sensorType];

      if (banner1[sensorProp] !== `${sensorPrefix}${trailId}0${markerId}0${sensorId}`) {
        banners[q][sensorProp] = `${sensorPrefix}${trailId}0${markerId}0${sensorId}`;
      }
      banners[q][valueProp] = temp;

      if (mtitle) {
        if (mtitle === ext_t) {
          banners[q].ext = 1;
        } else {
          banners[q].env = 1;
        }
      } else {
        banners[q].env = 1;
      }

      break;
    }
  }
}

function resetBannerValues(trailId, markerId, temp, sensorType) { //скидання екстремального банера у випадку повернення значень до нормальних
  const tmess = `OG${trailId}0${markerId}`;
  for (let q = 0; q < banners.length; q++) {
    const banner1 = banners[q];
    if (banner1.marker == tmess) {
      switch (sensorType) {
        case 'temp':
          if ((banner1.imp == null || banner1.imp < 8) && (banner1.wind == null || banner1.wind < 75)) {
            banners[q].ext = null;
          }
          banners[q].t_val = temp;
          break;
        case 'rain':
          banners[q].r_val = null;
          if (banner1.w_val === null && banner1.t_val === null && banner1.i_val === null) {
            banners[q].env = null;
          }
          break;
        case 'wind':
          if ((banner1.temp == null || (banner1.temp < 37 && banner1.temp > -25)) && (banner1.imp == null || banner1.imp < 8)) {
            banners[q].ext = null;
          }
          banners[q].w_val = temp;
          break;
        case 'imp':
          if ((banner1.temp == null || (banner1.temp < 37 && banner1.temp > -25)) && (banner1.wind == null || banner1.wind < 75)){
            banners[q].ext = null;
          }
          banners[q].i_val = temp;
          break;
        default:
          console.error('Unknown sensor type');
      }
      break;
    }
  }
}

function updateBannerTypeToEnv() { //налаштування типу банера з "екстремальний" на "погодні умови"
  let k = 0;
  for (let q = 1; q < banners.length; q++) {
    const banner1 = banners[q];
    if (banner1.ext === 1) {
      k = 1;
      break;
    }
  }

  if (k === 0) {
    banners[0].type = "env";
    banners[0].title2 = "1";
    banners[0].title = null;
  }
}

function clearBannerValues(trailId, markerId, type) { //очищення значень для відображення
  const tmess = `OG${trailId}0${markerId}`;
  for (let q = 0; q < banners.length; q++) {
    const banner1 = banners[q];
    if (banner1.marker === tmess) {
      if (type === 'temp') {
        banners[q].t_val = null;
      } else if (type === 'imp') {
        banners[q].i_val = null;
      } else if (type === 'wind') {
        banners[q].w_val = null;
      }
      if (banners[q].w_val === null && banners[q].r_val === null && banners[q].t_val === null && banners[q].i_val === null) {
        banners[q].env = null;
      }
      break;
    }
  }
}


function handleRainfallLogic(trailId, markerId, sensorId, temp, set) {
  const getTypeTitle = banners[0].type;
  let mtitle = "";

  if (set === 1) {
    mtitle = temp > 8 ? rain_0_t : rain_t;
    if (getTypeTitle === "usual") {
      banners[0].type = "env";
      banners[0].title2 = "1";
      banners[0].title = null;
      banners[0].rain = mtitle;
    } else if (banners[0].rain === null) {
      banners[0].rain = mtitle;
    }

    updateBannerSensor(trailId, markerId, sensorId, temp, "rain", null);
  } else {
    resetBannerValues(trailId, markerId, temp, "rain");
    resetBannerTypeIfNeeded();
  }
}

function handleWindLogic(trailId, markerId, sensorId, temp, set) {
  const getTypeTitle = banners[0].type;
  let mtitle = "";
  if (set === 1) {
    if (temp >= 75) {
      mtitle = ext_t;
      if (getTypeTitle !== "extreme") {
        banners[0].type = "extreme";
        banners[0].title2 = null;
        banners[0].title = ext_t;
      }
    } else if (temp >= 39) {
      mtitle = temp < 50 ? wind_t : wind_0_t;
      if (getTypeTitle === "usual") {
        banners[0].type = "env";
        banners[0].title2 = "1";
        banners[0].title = null;
        banners[0].wind = mtitle;
      } else if (banners[0].wind === null) {
        banners[0].wind = mtitle;
      }
    }

    updateBannerSensor(trailId, markerId, sensorId, temp, "wind", mtitle);
  } else {
    resetBannerValues(trailId, markerId, temp, "wind");

    if (temp >= 39) {
      mtitle = temp < 50 ? wind_t : wind_0_t;
      updateBannerTypeToEnv();
      banners[0].wind = mtitle;
    } else {
      clearBannerValues(trailId, markerId, "wind");
      resetBannerTypeIfNeeded();
    }
  }
}


function handleImpulsesLogic(trailId, markerId, sensorId, temp, set) {
  const getTypeTitle = banners[0].type;
  let mtitle = "";

  if (set === 1) {
    if (temp >= 8) {
      mtitle = ext_t;
      if (getTypeTitle !== "extreme") {
        banners[0].type = "extreme";
        banners[0].title2 = null;
        banners[0].title = ext_t;
      }
    } else {
      mtitle = imp_t;
      if (getTypeTitle === "usual") {
        banners[0].type = "env";
        banners[0].title2 = "1";
        banners[0].title = null;
        banners[0].imp = mtitle;
      } else if (banners[0].imp === null) {
        banners[0].imp = mtitle;
      }
    }

    updateBannerSensor(trailId, markerId, sensorId, temp, "imp", mtitle);
  } else {
    resetBannerValues(trailId, markerId, temp, "imp");

    if (temp >= 6) {
      mtitle = imp_t;
      updateBannerTypeToEnv();
      banners[0].imp = mtitle;
    } else {
      clearBannerValues(trailId, markerId, "imp");
      resetBannerTypeIfNeeded();
    }
  }
}

function resetBannerTypeIfNeeded() {
  let k = 0;
  for (let q = 1; q < banners.length; q++) {
    const banner1 = banners[q];
    if (banner1.env === 1 || banner1.ext === 1) {
      k = 1;
      break;
    }
  }
  if (k === 0) {
    banners[0].type = "usual";
    banners[0].title2 = null;
    banners[0].title = usual;
  }
}


async function processaMessage(topic, message) { //основна функція, перевірка вмісту вхідного повідомлення та його обробка відповідно до типу
  try {
    const jsonData = JSON.parse(message.toString());
    console.log("Received JSON data from topic",topic, ":", jsonData);

      if (jsonData.type === 0) {
        
        const trailId = jsonData["trail-id"];
        const markerId = jsonData["marker-id"];
        const sensorId = jsonData["sensor-id"];
        const temperature = parseInt(jsonData.temperature);
        const rainfall = parseFloat(parseFloat(jsonData.rainfall).toFixed(1));
        const windspeed = parseInt(jsonData.windspeed);
        const impulses = parseFloat(parseFloat(jsonData.impulses).toFixed(1));

        
        let imp = getImpulseDescription(impulses);

        // Отримання поточного часу
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });

        const queries = [
          { value: temperature, sensorId: `TS${trailId}0${markerId}0${sensorId}` },
          { value: rainfall, sensorId: `RF${trailId}0${markerId}0${sensorId}` },
          { value: windspeed, sensorId: `WS${trailId}0${markerId}0${sensorId}` },
          { value: imp, sensorId: `IS${trailId}0${markerId}0${sensorId}` }
        ];

        const client2 = await pool.connect();

        try {
          const result = await client.query(
            'SELECT MAX("DATA_ID") FROM "ENVIRONMENT_DATA" WHERE "date" = CURRENT_DATE'
          );
          const dataId = result.rows[0].max || 0;
          await insertEnvironmentData(client2, dataId, currentTime, queries);


          // Отримання поточної дати та часу
          let nowTime = new Date();
          let diff = nowTime - t;
          console.log('Date is received ',t1, ' ', t2 );
          console.log('Start Time: ', t);
          console.log('Current Time: ', nowTime);
          console.log('Differ: ', diff);
          console.log('Differ in minutes: ', Math.floor(diff / (1000 * 60)));
          diff = diff / (1000 * 60 * 60);
          console.log('Differ in hours: ', Math.floor(diff));

          if(Math.floor(diff)>=1 && t!==0) { // з моменту отримання останніх даних про погодні умови пройшло більше години
            t = nowTime;
            t1 = 0;
            t2 = 0;
            updateEnvironment(client2,trailId);           
          }

          if (t1 === 0) { // надійшли дані про погодні умови з першого маркера
            t1 = 1;
            if (t === 0) { // час, коли надійшли останні дані, дані поки не надходили

              let nowTime = new Date();

              t = nowTime;
            }
          }
          else if (t1 === 1 && t2 === 0) { // надійшли дані з другого маркера
            t2 = 1;
            insertTemporaryEnvironmentData(client2,currentTime,trailId); 
          }
        } finally {
          client2.release();
        }
      }
    if (jsonData.type === 9) { // дані про погодні умови зі складних маркерів
        const trailId = jsonData["trail-id"];
        const markerId = jsonData["marker-id"];
        const sensorId = jsonData["sensor-id"];
        const temperature = parseInt(jsonData.temperature);
        const rainfall = parseFloat(parseFloat(jsonData.rainfall).toFixed(1));
        const windspeed = parseInt(jsonData.windspeed);
        const impulses = parseFloat(parseFloat(jsonData.impulses).toFixed(1));
        const w = parseFloat(parseFloat(jsonData.windirection).toFixed(1));
        const pressure = parseInt(jsonData.pressure);
        const humidity = parseInt(jsonData.humidity);
        const cloudiness = parseInt(jsonData.cloudiness);
        let imp = 0;
        let cl = 0
        let wd = 0

        imp = getImpulseDescription(impulses);

        cl = getCloudinessDescription(cloudiness);

        wd = getWindDirectionDescription(w);

        const queries = [
          { value: temperature, sensorId: `TS${trailId}0${markerId}0${sensorId}` },
          { value: rainfall, sensorId: `RF${trailId}0${markerId}0${sensorId}` },
          { value: windspeed, sensorId: `WS${trailId}0${markerId}0${sensorId}` },
          { value: imp, sensorId: `IS${trailId}0${markerId}0${sensorId}` },
          { value: wd, sensorId: `WD${trailId}0${markerId}0${sensorId}` },
          { value: pressure, sensorId: `AP${trailId}0${markerId}0${sensorId}` },
          { value: humidity, sensorId: `HS${trailId}0${markerId}0${sensorId}` },
          { value: cl, sensorId: `CL${trailId}0${markerId}0${sensorId}` },
        ];

        // Отримання поточного часу
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
        const client2 = await pool.connect();
        try {
          const result = await client2.query(
            'SELECT MAX("DATA_ID") FROM "ENVIRONMENT_DATA" WHERE "date" = CURRENT_DATE'
          );
          const dataId = result.rows[0].max || 0;

          await insertEnvironmentData(client2, dataId, currentTime, queries);

          let nowTime = new Date();
          let diff = nowTime - t;
          console.log('Date is received ',t1, ' ', t2 );
          console.log('Start Time: ', t);
          console.log('Current Time: ', nowTime);
          console.log('Differ: ', diff);
          console.log('Differ in minutes: ', Math.floor(diff / (1000 * 60)));
          diff = diff / (1000 * 60 * 60);
          console.log('Differ in hours: ', Math.floor(diff));

          if(Math.floor(diff)>=1 && t!==0) { //оновлення погодних даних щогодини
            t = currentHour;
            t1 = 0;
            t2 = 0;
            updateEnvironment(client2, trailId);            
          }

          if (t1 === 0) {
            t1 = 1;
            if (t === 0) {
              let nowTime = new Date();
              t = nowTime;
            }
          }
          else if (t1 === 1 && t2 === 0) {
            t2 = 1;
            insertTemporaryEnvironmentData(client2, currentTime, trailId); 
          }
        } finally {
          client2.release();
        }
      }

      if (jsonData.type === 5) { //дані про рух туристів
        const trailId = jsonData["trail-id"];
        const markerId = jsonData["marker-id"];
        const sensorId = jsonData["sensor-id"];
        const direct = jsonData.direction;
        const num = parseInt(jsonData.number);
        let direction = 0

        if (direct === 0) {
          direction = "Прямий"
        } else {
          direction = "Зворотній"
        }

        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
        const client2 = await pool.connect();
        try {
          insertTouristData(client2, trailId, markerId, sensorId, direction, num, currentTime);

          if (tm === 0) {
            tm = new Date;
          }

          let nowDate = new Date();

          if(nowDate.getHour() > tm.getHour() || nowDate.getDate() > tm.getDate() || nowDate.getMonth() > tm.getMonth() || nowDate.getFullYear() > tm.getFullYear()) {
            tm = nowDate;
            insertTouristsData(client2);

            insertAttendanceData(client2);
          }

        } finally {
          client2.release();
        }
      }

      if (jsonData.type === 1 || jsonData.type === 2 || jsonData.type === 3 || jsonData.type === 4 || jsonData.type === 6 ) {
        const trailId = jsonData["trail-id"];
        const markerId = jsonData["marker-id"];
        const sensorId = jsonData["sensor-id"];
        const temp = jsonData.temp;
        const val = parseFloat(parseFloat(jsonData.value).toFixed(1));
        const { warn_type, descr } = createWarningDescription(jsonData);

        if (temp === 1) { // попередження надійшло вперше (якщо рівне 0 - дані змінились, попередження нині недійсне)
          const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
          const client2 = await pool.connect();
          try {
            
            insertWarningData(client2, jsonData.type, currentTime, warn_type, descr, trailId, markerId, sensorId);

          } finally {
            client2.release();
          }
        }
      }

      let trailId = 0;
      let markerId = 0;
      let sensorId = 0;
      let temp = 0;
      let set = 0;



      if (jsonData.type != 6){
        trailId = jsonData["trail-id"];
        markerId = jsonData["marker-id"];
        sensorId = jsonData["sensor-id"];
        temp = parseFloat(parseFloat(jsonData.value).toFixed(1));
        set = jsonData.temp;
        updateBannerMarkers(trailId, markerId);
      }

      if (jsonData.type === 1) {
        handleTemperatureLogic(trailId, markerId, sensorId, temp, set);
        app.get('/banners', (req, res) => {
          res.json(banners);
        });
      }

      if (jsonData.type === 2) {
        handleRainfallLogic(trailId, markerId, sensorId, temp, set);
        app.get('/banners', (req, res) => {
          res.json(banners);
        });
      }

      if (jsonData.type === 3) {
        handleWindLogic(trailId, markerId, sensorId, temp, set);
        app.get('/banners', (req, res) => {
          res.json(banners);
        });
      }

      if (jsonData.type === 4) {
        handleImpulsesLogic(trailId, markerId, sensorId, temp, set);
        app.get('/banners', (req, res) => {
          res.json(banners);
        });
      }

  } catch (error) {
    console.error("Error:", error);
  }
}

const ext_t = 'Екстремальні погодні умови. Походи заборонено. Негайно знайдіть найближче безпечне місце.';
const temp_h_t = 'Увага! Висока температура повітря, можливий тепловий удар.';
const temp_c_t = 'Низька температура, потрібна належна підготовка.';
const wind_t = 'Будьте обережні, на шляху досить сильний вітер.';
const wind_0_t = 'Увага!!! Сильний вітер, можливі шторми/бурі.';
const rain_t = 'Опади. Захопіть дощовики.';
const rain_0_t = 'Сильні опади! Будьте обережні під час ходьби по мокрій землі та камінню.';
const usual = 'Безпечної та незабутньої подорожі вам!';
const imp_t = 'Обережно! Ймовірні каменепади/снігові лавини/землетруси';

const banner = {
  marker: null,
  t_sensor: null,
  t_type: 'Температура: ',
  t_val: null,
  w_sensor: null,
  w_type: 'Швидкість вітру: ',
  w_val: null,
  r_sensor: null,
  r_type: 'Опади: ',
  r_val: null,
  i_sensor: null,
  i_type: 'Імпульси землі: ',
  i_val: null,
  ext: null,
  env: null,
};

let banners = [
     {title: "Шлях безпечний",
     type: "usual",
     title2: null,
     temp: null,
     wind: null,
     rain: null,
     imp: null
   },
];
console.log(banners);
app.get('/banners', (req, res) => {
  res.json(banners);
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

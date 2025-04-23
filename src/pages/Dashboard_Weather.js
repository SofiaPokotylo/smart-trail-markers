import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  banner: {
    backgroundColor: 'rgba(209, 21, 21, 0.1)',
    color: '#721c24',
    padding: '10px',
    border: '1px solid #f5c6cb',
    borderRadius: '5px',
  },
  banner2: {
    backgroundColor: 'rgba(74, 224, 179, 0.1)',
    color: 'black',
    fontSize: '54px',
    padding: '10px',
    margin: '20px',
    border: '2px solid #1f1da1',
    borderRadius: '5px',
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));



function Dashboard3({pickedDate, pickedTime}) {
  const classes = useStyles();
  const [banners, setBanners] = useState([]);
const [weatherData, setweatherData] = useState(null);
const [touristData, setTouristData] = useState(null);
const [values, setValues] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/banners')
      .then(response => response.json())
      .then(data => setBanners(data))
      .catch(error => console.error('Error fetching banner data:', error));
    getLastValues();
  }, []);
  function getLastValues() {
    fetch('http://localhost:3001/last-values', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(values => {
        setValues(values);
      })
      .catch(error => {
        console.error('Error retrieving last date:', error);
      });
  }

  const date = pickedDate ? pickedDate : values.date;
  const time = pickedTime ? pickedTime : values.time;

  useEffect(() => {
    getWeatherData();
  }, [date, time]);

  function getWeatherData() {
    

    fetch('http://localhost:3001/weather-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, time })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(weatherData => {
        setweatherData(weatherData);
      })
      .catch(error => {
        console.error('Error retrieving weather data:', error);
      });
  }

  useEffect(() => {
    getTouristData();
  }, [date]);

  function getTouristData() {
    

    fetch('http://localhost:3001/tourist-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(touristData => {
        setTouristData(touristData);
      })
      .catch(error => {
        console.error('Error retrieving tourist data:', error);
      });
  }

  return (
    <div className={classes.root}>
    
        {banners.map((banner, index) => (
        <div key={index}>
    {banner.title && (
      <div className={classes.banner2}>
        <p>{banner.title}</p>
        <p>{banner.title2}</p>
      </div>
    )}
    {banner.title2 && (
      <div className={classes.banner}>
        <p>
          {banner.temp} {banner.wind} {banner.rain} {banner.imp}
        </p>
      </div>
    )}
    {(banner.env || banner.ext) && (
      <div className={classes.banner}>
        <p>{banner.marker}</p>
      </div>
    )}
    {(banner.env || banner.ext) && (
      <div className={classes.banner}>
        <p>
          {banner.t_val && ` _-_ ${banner.t_type}: ${banner.t_val} _-_  `}
          {banner.w_val && ` _-_ ${banner.w_type}: ${banner.w_val} _-_  `}
          {banner.i_val && ` _-_ ${banner.i_type}: ${banner.i_val} _-_  `}
          {banner.r_val && ` _-_ ${banner.r_type}: ${banner.r_val} _-_  `}
        </p>
      </div>
    )}
  </div>

    ))}
    <hr></hr>
    <h1 className="display-4 text-center my-5">Дата</h1>
    <h1 className="display-4 text-center my-5">{date}</h1>
    <hr></hr>
    <h1 className="display-4 text-center my-5">Погодні умови</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Швидкість вітру
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (
                  <p>{weatherData.WIND_SPEED} км/год</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Напрямок вітру
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (
                  <p>{weatherData.WIND_DIRECTION}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Температура
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (
                  <p>{weatherData.TEMPERATURE}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Вологість
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (   
                  <p>{weatherData.HUMIDITY && `${weatherData.HUMIDITY}%`}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Тиск
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (
                  <p>{weatherData.PRESSURE}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Опади
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (
                  <p>{weatherData.RAINFALL}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Хмарність
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (
                  <p>{weatherData.CLOUDINESS}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Імпульси
            </Typography>
            <Typography variant="h3">
            <div>
              {weatherData ? (
                  <p>{weatherData.IMPULSES}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Час
            </Typography>
            <Typography variant="h3">
            <div>
              <p>{time}</p>
            </div>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <br></br>
      <br></br>
      <br></br>
      <h1 className="display-4 text-center my-5">Відвідуваність</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Повний прямий шлях
            </Typography>
            <Typography variant="h3">
            <div>
              {touristData ? (
                  <p>{touristData.TOURISTS_NUM_DIRECT}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Повний зворотній шлях
            </Typography>
            <Typography variant="h3">
             <div>
              {touristData ? (
                  <p>{touristData.TOURISTS_NUM_REVERSE}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Загальна кількість
            </Typography>
            <Typography variant="h3">
             <div>
              {touristData ? (
                  <p>{touristData.TOURISTS_NUM_DIRECT + touristData.TOURISTS_NUM_REVERSE}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </div>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default Dashboard3;
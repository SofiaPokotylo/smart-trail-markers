import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
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

function Dashboard({num}) {
  const classes = useStyles();

  //let num = 1;
const [trailData, setTrailData] = useState(null);


  useEffect(() => {
    getTrail();
  }, []);
  function getTrail() {
    fetch('http://localhost:3001/trail-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ num })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(trailData => {
        setTrailData(trailData);
      })
      .catch(error => {
        console.error('Error retrieving last date:', error);
      });
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Довжина
            </Typography>
            <Typography variant="h3">
              {trailData ? (
                  <p>{trailData.LENGTH} км</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Складність
            </Typography>
            <Typography variant="h3">
            {trailData ? (
                  <p>{trailData.COMPLEXITY}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Тривалість
            </Typography>
            <Typography variant="h3">
            {trailData ? (
                  <p>{trailData.DURATION}</p>
              ) : (
                <p>Відсутні дані</p>
              )}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default Dashboard;

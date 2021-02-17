import React from 'react';
import { Card, CardContent, Typography, Grid, createMuiTheme } from '@material-ui/core';
import styles from './Cards.module.css';
import CountUp from 'react-countup';
import cx from 'classnames';
import {  Loader } from 'semantic-ui-react';

const Cards = ({ data: { confirmed, recovered, deaths, lastUpdate } }) => {

    const theme = createMuiTheme({
     
        palette: {
          primary: {
            main: 'rgba(0,0,255,0.5)',
            dark: 'rgba(0,255,0,0.5)'
          }
        }
      });


    if(!confirmed) {
        return  <Loader active inline="centered">Loading...</Loader>
    }

    return (
        <div className={styles.container}>
            <h1>World COVID-19 DATA</h1>
            <Grid container spacing={3} justify="center">
                <Grid item component={Card} xs={12} md={3} className={cx(styles.card, styles.infected)}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            INFECTED
                        </Typography>
                        <Typography color="primary" variant="h3">
                            <CountUp 
                                start={0}
                                end={confirmed.value}
                                duration={2.5}
                                separator=","
                            />
                        </Typography>
                        <Typography>
                            {new Date(lastUpdate).toDateString()}
                        </Typography>
                        <Typography variant="body2">
                            Number of active cases of COVID-19
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid item component={Card} xs={12} md={3} className={cx(styles.card, styles.recovered)}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            RECOVERED
                        </Typography>
                        <Typography variant="h3">
                        <CountUp 
                                start={0}
                                end={recovered.value}
                                duration={2.5}
                                separator=","
                            />
                        </Typography>
                        <Typography>
                        {new Date(lastUpdate).toDateString()}
                        </Typography>
                        <Typography variant="body2">
                            Number of recoveries from COVID-19
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid item component={Card} xs={12} md={3} className={cx(styles.card, styles.deaths)}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            DEATHS
                        </Typography>
                        <Typography variant="h3" color="error">
                        <CountUp 
                                start={0}
                                end={deaths.value}
                                duration={2.5}
                                separator=","
                            />
                        </Typography>
                        <Typography>
                        {new Date(lastUpdate).toDateString()}
                        </Typography>
                        <Typography variant="body2">
                            Deaths caused by COVID-19
                        </Typography>
                    </CardContent>
                </Grid>
            </Grid>
        </div>
    )
}

export default Cards;
import React, { useState, useEffect } from 'react';
import { fetchDailyData } from '../../api';
import { Line, Bar } from 'react-chartjs-2';
import { Paper } from '@material-ui/core';
import styles from './Chart.module.css';


const Chart = ({ data: {confirmed, deaths, recovered}, country }) => {

    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            setDailyData(await fetchDailyData());
        }

        fetchAPI();
    }, [dailyData])

    // LINE CHART
    const lineChart = (
        // if dailyData is available return Line Chart
        dailyData.length 
        ? (<Line
            data={
                {
                labels: dailyData.map(({ date }) => new Date(date).toLocaleDateString()),
                datasets: [{
                    data: dailyData.map(({ confirmed }) => confirmed),
                    label: 'Infected',
                    borderColor: '#3333ff',
                    fill: true,
                }, {
                    data: dailyData.map(({ deaths }) => deaths),
                    label: 'Deaths',
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.5)',
                    fill: true,
                }],
            }}
              
            />
            // but if it's not available return null
            ): null
    )


    // BAR CHART
    const barChart = (
        confirmed 
        ? (
            <Bar
                data={{
                    labels: ['Infected', 'Recovered', 'Deaths'],
                    datasets: [
                        {
                        label: 'People',
                        backgroundColor: [
                            'rgba(255,0,0,0.5)',
                            'rgba(0,255,0,0.5)',
                            'rgba(0,0,255,0.5)'],
                        data: [confirmed.value, recovered.value, deaths.value],
                    }
                ],
                }} 
                options={{
                    legend: { display: false },
                    title: { 
                        display: true, 
                        text: `Current state in ${country}`,
                        fontSize: 30 },
                }}  
            />
        ) : null
    )

    return (
        <div className={styles.container}>
            <Paper elevation={3}>
            {country ? barChart : lineChart}  
            </Paper>
        </div>
    )
}

export default Chart;
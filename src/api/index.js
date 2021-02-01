import axios from 'axios';

const url = 'https://covid19.mathdro.id/api';

export const fetchData = async (country) => {
    
    let changeableURL = url;

    if (country) {
        changeableURL = `${url}/countries/${country}`
    }

    try{
        const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(changeableURL);
        return {
            confirmed,
            recovered,
            deaths,
            lastUpdate,
        };
    } catch (error) {

    }
}

export const fetchDailyData = async () => {
    try {
        const {data} = await axios.get(`https://api.covidtracking.com/v1/us/daily.json`)
        
        return data
            .map(({ positive, death, dateChecked}) => ({
            confirmed: positive,
            deaths: death,
            date: dateChecked,
        }))
            .reverse();

    } catch (error) {
        return error;
    }
}

export const fetchCountries = async () => {
    try {
        const { data: { countries }} = await axios.get('https://covid19.mathdro.id/api/countries');
        return countries.map((country) => country.name);
    } catch (error) {
        console.log(error)
    }
}
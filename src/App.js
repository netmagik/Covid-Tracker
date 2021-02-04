import React from 'react';
import {Cards, Chart, CountryPicker, States} from './components';
import styles from './App.module.css';
import {fetchData} from './api';
import coronaImage from './images/image.png';

class App extends React.Component {

    state = {
        data: {},
        country: '',
    }

    async componentDidMount() {
        const fetchedData = await fetchData();

        this.setState({data: fetchedData});
    }

    handleCountryChange = async (country) => {
       
        // fetch Data
        const fetchedData = await fetchData(country)
        console.log(fetchedData);
        console.log(country)
        // Set State
        this.setState({data: fetchedData, country: country});
    }

    render() {
        const {data, country} = this.state;

        return (
            <div className={styles.container}>
                <img className={styles.image} alt="Covid-19" src={coronaImage} />
                <Cards data={data}/>
                <CountryPicker handleCountryChange={this.handleCountryChange}/>
                <Chart data={data} country={country} />
                <States />
            </div>
        )
    }
}

export default App;
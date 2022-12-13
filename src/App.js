import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Cards, Chart, CountryPicker, States, Countries, Footer } from './components';
import styles from './App.module.css';
import {fetchData} from './api';
import coronaImage from './images/covid.png';

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
        // Set State
        this.setState({data: fetchedData, country: country});
    }

    render() {
        const {data, country} = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img className={styles.image} alt="Covid-19" src={coronaImage} />
                        <h4>COVID-19 TRACKER</h4>
                    </div>
  
                    {/* <div className={styles.nav}>
                        <AnchorLink href='#countries'>All Countries</AnchorLink>
                        <AnchorLink href='#states'>United States</AnchorLink>
                        <AnchorLink href='#chart'>Daily Data</AnchorLink>
                    </div> */}
                
                </div>

                {/* <Cards data={data}/>
                <section id="countries"><Countries /></section> */}
                <section id="states"><States /></section>
                {/* <section id="chart"><CountryPicker handleCountryChange={this.handleCountryChange}/></section> */}
                {/* <Chart data={data} country={country} /> */}
                <Footer />
            </div>
        )
    }
}

export default App;
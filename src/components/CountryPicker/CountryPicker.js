import React, {useState, useEffect} from 'react';
import { NativeSelect, FormControl } from '@material-ui/core';
import styles from './CountryPicker.module.css';

import { fetchCountries } from '../../api';


const CountryPicker = ({ handleCountryChange }) => {

    const [fetchedCountries, setFetchedCountries] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            setFetchedCountries(await fetchCountries());
        }
        fetchAPI();
    }, [])


    return (
        <>
        <h1>Select Country</h1>
        <FormControl className={styles.formControl}>
            <NativeSelect className={styles.select} defaultValue="" onChange={(e) => 
                handleCountryChange(e.target.value)}>

                <option value="">United States</option>
                {fetchedCountries.map((country, i) => 
                <option key={i} value={country}>
                    {country}
                </option>

                )}
            </NativeSelect>
        </FormControl>
        </>
    )
}

export default CountryPicker;
import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Grid, TextField} from '@material-ui/core';
import { url } from '../../api/';
import { Flag } from 'semantic-ui-react';
import styles from './Countries.module.css';

const Countries = () => {

    const [countryData, setCountryData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('confirmed');
    const [updatedData, setUpdatedData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
          const data = await fetch(`${url}/deaths`).then(data => data.json());
          const grouped =data.reduce((x, value) => {
            if (!x[value.countryRegion]) {
                x[value.countryRegion] =[];
            }
            x[value.countryRegion].push(value);
            return x;
          }, {});
          const tableData = [];
          
          Object.entries(grouped).forEach((country, index) => {
            let confirmed = 0;
            let deaths = 0;
            let recovered = 0;
            let active = 0;
            tableData.push({ country: country[0] })
            country[1].forEach(i => {
              confirmed += i.confirmed;
              deaths += i.deaths;
              recovered += i.recovered;
              active += i.active;
              tableData[index].iso2 = i.iso2;
              tableData[index].confirmed = confirmed;
              tableData[index].deaths = deaths;
              tableData[index].recovered = recovered;
              tableData[index].active = active;
              tableData[index].mortality = parseFloat((Math.round(deaths * 100) / confirmed).toFixed(1));
            })
          })
          setCountryData(tableData);
          setUpdatedData(tableData);
        }
        fetchStats();
      }, []);

      if (!countryData) return <p>loading...</p>


    // STYLES
    const StyledTableCell = withStyles(() => ({
        head: {
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '1rem'
        },
        body: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      }))(TableCell);

      const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }))(TableRow);

      // Format Numbers with commas
      function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }

      // Sort functions
      function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }
      
      function getComparator(order, orderBy) {
        return order === 'asc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }
      
      function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }

      // Array of Column Headings
    const headCells = [
        { id: "country", label: "COUNTRY" },
        { id: "confirmed", numeric: true, label: "POSITIVE" },
        { id: "deaths", numeric: true, label: "DEATHS" },
        { id: "recovered", numeric: true, label: "RECOVERED" },
    ];

    function EnhancedTableHead(props) {
        const {order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };        

    return (
                    <TableHead className={styles.head}>
                        <StyledTableRow>
                        {headCells.map(headCell => (
                           <StyledTableCell
                             key={headCell.id}
                             align="left"
                             width="50"
                             sortDirection={orderBy === headCell.id ? order : false}
                           >
                             <TableSortLabel
                               active={orderBy === headCell.id}
                               direction={orderBy === headCell.id ? order : "asc"}
                               onClick={createSortHandler(headCell.id)}
                             >
                               {headCell.label}
                               {orderBy === headCell.id ? (
                                 <span>
                                   {order === "desc"}
                                 </span>
                               ) : null}
                             </TableSortLabel>
                           </StyledTableCell>
                        ))}
                        </StyledTableRow>
                    </TableHead>
    );
    }

    EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
      };

    const tableBody = (
        <TableBody>
        {stableSort(updatedData, getComparator(order, orderBy))
            .map((data) => {
                return (
                    <StyledTableRow key={data.country}>
                    <StyledTableCell width='100' component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    <Flag name={data.country.toLowerCase()} />  {data.country}
                    </StyledTableCell>
                    <StyledTableCell align="left" width='50' style={{ color: 'rgba(0, 139, 139, 0.8)' }}>
                        {formatNumber(data.confirmed)}
                        <p className={styles.count}>confirmed</p>
                    </StyledTableCell>
                    <StyledTableCell align="left" width='50' style={{ color: 'rgba(255, 0, 0, 0.8)' }}>
                        {formatNumber(data.deaths)}
                        <p className={styles.count}>deaths</p>
                    </StyledTableCell>
                    <StyledTableCell align="left" width='50' style={{ color: 'rgba(139, 139, 255, 0.9)' }}>
                        {data.recovered > 0 ? formatNumber(data.recovered) : 0}
                        <p className={styles.count}>recovered</p>
                    </StyledTableCell>
                </StyledTableRow>
                )
            })}
    </TableBody>
    )

        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
          };

        const filterByCountry = (e) => {
          const newData = countryData.slice();
          setUpdatedData(
            newData.filter(({country}) => 
              country.toLowerCase().includes(e.toLowerCase().trim()))
            )
        }

        return (
            <div className={styles.container}>
                {countryData.length > 1 ? (
                  <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <h1 className={styles.title}>All Countries</h1>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          variant="outlined"
                          label="Search By Country"
                          onChange={(e) => {
                          filterByCountry(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Paper className={styles.root} elevation={3}>
                          <TableContainer className={styles.table} >
                            <Table stickyHeader aria-label="sticky table">
                              <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                              />
                              {tableBody}
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Grid>
                    </Grid>
                  ) : <h1>Data Not Available</h1>}
              </div>
        )
    }

export default Countries;
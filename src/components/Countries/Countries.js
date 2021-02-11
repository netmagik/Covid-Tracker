import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel} from '@material-ui/core';
import { url } from '../../api/';
import styles from './Countries.module.css';

const Countries = () => {

    const [countryData, setCountryData] = useState([]);

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
          console.log(grouped);
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
              tableData[index].iso3 = i.iso3;
              tableData[index].confirmed = confirmed;
              tableData[index].deaths = deaths;
              tableData[index].recovered = recovered;
              tableData[index].active = active;
              tableData[index].mortality = parseFloat((Math.round(deaths * 100) / confirmed).toFixed(1));
            })
          })
          setCountryData(tableData);
        }
        fetchStats();
        console.log(countryData);
      }, []);
      if (!countryData) return <p>loading...</p>


    // // STYLES
    // const StyledTableCell = withStyles(() => ({
    //     head: {
    //       fontWeight: 700,
    //       textTransform: 'uppercase',
    //       letterSpacing: 1,
    //       fontSize: '1.3rem'
    //     },
    //     body: {
    //       fontSize: 18,
    //       fontWeight: 700
    //     },
    //   }))(TableCell);

    //   const StyledTableRow = withStyles((theme) => ({
    //     root: {
    //       '&:nth-of-type(odd)': {
    //         backgroundColor: theme.palette.action.hover,
    //       },
    //     },
    //   }))(TableRow);

    //   const useStyles = makeStyles((theme) => ({
    //     paper: {
    //         width: '100%',
    //         marginBottom: theme.spacing(4),
    //       },
    //     table: {
    //       minWidth: 100,
    //     },
    //     container: {
    //         maxHeight: 440,
    //       },
    //   }));

    //   // Format Numbers with commas
    //   function formatNumber(num) {
    //     return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    //   }

    //   // Sort functions
    //   function descendingComparator(a, b, orderBy) {
    //     if (b[orderBy] < a[orderBy]) {
    //       return -1;
    //     }
    //     if (b[orderBy] > a[orderBy]) {
    //       return 1;
    //     }
    //     return 0;
    //   }
      
    //   function getComparator(order, orderBy) {
    //     return order === 'desc'
    //       ? (a, b) => descendingComparator(a, b, orderBy)
    //       : (a, b) => -descendingComparator(a, b, orderBy);
    //   }
      
    //   function stableSort(array, comparator) {
    //     const stabilizedThis = array.map((el, index) => [el, index]);
    //     stabilizedThis.sort((a, b) => {
    //       const order = comparator(a[0], b[0]);
    //       if (order !== 0) return order;
    //       return a[1] - b[1];
    //     });
    //     return stabilizedThis.map((el) => el[0]);
    //   }

    //   // Array of Column Headings
    // const headCells = [
    //     { id: "country", label: "COUNTRY" },
    //     { id: "confirmed", numeric: true, label: "POSITIVE" },
    //     { id: "deaths", numeric: true, label: "DEATHS" },
    //     { id: "recovered", numeric: true, label: "RECOVERED" },
    // ];

    // function EnhancedTableHead(props) {
    //     const {order, orderBy, onRequestSort } = props;
    //     const createSortHandler = (property) => (event) => {
    //       onRequestSort(event, property);
    //     };        

    // return (
    //                 <TableHead>
    //                     <TableRow>
    //                     {headCells.map(headCell => (
    //                        <StyledTableCell
    //                          key={headCell.id}
    //                          align="left"
    //                          width="50"
    //                          sortDirection={orderBy === headCell.id ? order : false}
    //                        >
    //                          <TableSortLabel
    //                            active={orderBy === headCell.id}
    //                            direction={orderBy === headCell.id ? order : "asc"}
    //                            onClick={createSortHandler(headCell.id)}
    //                          >
    //                            {headCell.label}
    //                            {orderBy === headCell.id ? (
    //                              <span>
    //                                {order === "desc"}
    //                              </span>
    //                            ) : null}
    //                          </TableSortLabel>
    //                        </StyledTableCell>
    //                     ))}
    //                     </TableRow>
    //                 </TableHead>
    // );
    // }

    // EnhancedTableHead.propTypes = {
    //     onRequestSort: PropTypes.func.isRequired,
    //     order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    //     orderBy: PropTypes.string.isRequired,
    //   };

    //     const [order, setOrder] = useState('asc');
    //     const [orderBy, setOrderBy] = useState('country');

    //     const handleRequestSort = (event, property) => {
    //         const isAsc = orderBy === property && order === 'asc';
    //         setOrder(isAsc ? 'desc' : 'asc');
    //         setOrderBy(property);
    //       };
        
    //     const classes = useStyles();

    //     return (
    //         <div className={styles.container}>
    //              {countryData.length > 1 ? (
    //             <div>
    //             <h1>World Data</h1>
    //             <Paper className={classes.paper} elevation={3}>
    //             <TableContainer className={classes.container}>
    //                 <Table className={classes.table} stickyHeader aria-label="sticky table">
    //                     <EnhancedTableHead 
    //                         order={order}
    //                         orderBy={orderBy}
    //                         onRequestSort={handleRequestSort}
    //                     />
    //                     <TableBody>
    //                         {stableSort(countryData, getComparator(order, orderBy))
    //                             .map((data) => {
    //                                 return (
    //                                     <StyledTableRow key={data.country}>
    //                                     <StyledTableCell width='100' component="th" scope="row">
    //                                         {data.country}
    //                                     </StyledTableCell>
    //                                     <StyledTableCell align="left" width='50' style={{ color: 'rgba(0, 139, 139, 0.8)' }}>
    //                                         {formatNumber(data.confirmed)}
    //                                     </StyledTableCell>
    //                                     <StyledTableCell align="left" width='50' style={{ color: 'rgba(255, 0, 0, 0.8)' }}>
    //                                         {formatNumber(data.deaths)}
    //                                     </StyledTableCell>
    //                                     <StyledTableCell align="left" width='50' style={{ color: 'rgba(139, 139, 255, 0.9)' }}>
    //                                         {data.recovered > 0 ? formatNumber(data.recovered) : 0}
    //                                     </StyledTableCell>
    //                                 </StyledTableRow>
    //                                 )
    //                             })}
    //                     </TableBody>
    //                 </Table>
    //             </TableContainer>
    //             </Paper>
    //         </div>
    //               ) : <h1>Data Not Available</h1>}
    //         </div>
    //     )
    // }

    return <h1>Data</h1>
    
    }
export default Countries;
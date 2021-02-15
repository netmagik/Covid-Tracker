import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Grid } from '@material-ui/core';
import { fetchStates } from '../../api/';
import styles from './States.module.css';

const State = (state) => {

    const [stateData, setStateData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('positive');
    const [updatedData, setUpdatedData] = useState([]);

    // Get DATA from the API
    useEffect(() => {
        const fetchAPI = async () => {
          const data = await fetchStates(state);
            setStateData(data);
            setUpdatedData(data);
        }
        fetchAPI();
    }, [state])

    // STYLES
    const StyledTableCell = withStyles(() => ({
        head: {
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '1rem'
        },
        body: {
          fontSize: 18,
          fontWeight: 'bold'
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
        { id: "state", label: "STATE" },
        { id: "positive", numeric: true, label: "POSITIVE" },
        { id: "death", numeric: true, label: "DEATHS" },
        { id: "hospitalized", numeric: true, label: "HOSPITALIZED" },
    ];

    function EnhancedTableHead(props) {
        const {order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };        

    return (
                    <TableHead className={styles.head}>
                        <TableRow>
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
                        </TableRow>
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
                    <StyledTableRow key={data.state}>
                    <StyledTableCell width='100' component="th" scope="row">
                        {data.state}
                    </StyledTableCell>
                    <StyledTableCell align="left" width='50' style={{ color: 'rgba(0, 139, 139, 0.8)' }}>
                        {formatNumber(data.positive)}
                        <p className={styles.count}>confirmed</p>
                    </StyledTableCell>
                    <StyledTableCell align="left" width='50' style={{ color: 'rgba(255, 0, 0, 0.8)' }}>
                        {formatNumber(data.death)}
                        <p className={styles.count}>deaths</p>
                    </StyledTableCell>
                    <StyledTableCell align="left" width='50' style={{ color: 'rgba(139, 139, 255, 0.9)' }}>
                        {data.hospitalized > 0 ? formatNumber(data.hospitalized) : 0}
                        <p className={styles.count}>hospitalized</p>
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

        const filterByState = (e) => {
          const newData = stateData.slice();
            setUpdatedData(
              newData.filter(({state}) => 
                // convertState(state.toLowerCase().includes(e.toLowerCase().trim())))
               state.toUpperCase().includes(e.toUpperCase().trim())
              ))
              console.log(updatedData)
          }

        return (
            <div className={styles.container}>
              {stateData.length > 1 ? (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <h1 className={styles.title}>United States</h1>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                          variant="outlined"
                          label="Search By State"
                          inputProps={{ maxLength: 2 }}
                          onChange={(e) => {
                          filterByState(e.target.value);
                          }}
                        />
                  </Grid>
                  <Grid item xs={12}>
                    <Paper className={styles.root} elevation={3}>
                    <TableContainer className={styles.table}>
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
                  ) : <h1>State Data Not Available</h1>}
            </div>
        )
    }

export default State;
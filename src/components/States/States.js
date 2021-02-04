import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@material-ui/core';
import { fetchStates } from '../../api/';
import styles from './States.module.css';

const State = (state) => {

    const [stateData, setStateData] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            setStateData(await fetchStates(state));
        }
        console.log(stateData)

        fetchAPI();
    }, [state])

    const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1
        },
        body: {
          fontSize: 18,
          fontWeight: 700
        },
      }))(TableCell);

      const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }))(TableRow);

      const useStyles = makeStyles({
        table: {
          minWidth: 100,
        },
      });

      function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }

      const classes = useStyles();

    return (
        <div className={styles.container}>
            {stateData.length > 1 ? (
                <div>
                <h1>State Data</h1>
                <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width='100'><TableSortLabel active></TableSortLabel> State </StyledTableCell>
                            <StyledTableCell align='left' width='50'>Positive </StyledTableCell>
                            <StyledTableCell align='left' width='50'>Deaths </StyledTableCell>
                            <StyledTableCell align='left' width='50'>Hospitalized </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stateData.map((data) => (
                            <StyledTableRow key={data.state}>
                                <StyledTableCell component="th" scope="row">
                                    {data.state}
                                </StyledTableCell>
                                <StyledTableCell align="left" style={{ color: 'rgba(0, 139, 139, 0.8)' }}>
                                    {formatNumber(data.positive)}
                                </StyledTableCell>
                                <StyledTableCell align="left" style={{ color: 'rgba(255, 0, 0, 0.8)' }}>
                                    {formatNumber(data.death)}
                                </StyledTableCell>
                                <StyledTableCell align="left" style={{ color: 'rgba(139, 139, 255, 0.9)' }}>
                                    {data.hospitalized > 0 ? formatNumber(data.hospitalized) : 0}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>   
            </TableContainer>
            </div>
            ) : <h1>State Data Not Available</h1>}



        </div>
    )
}

export default State;
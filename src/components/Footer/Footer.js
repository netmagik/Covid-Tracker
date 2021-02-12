import React from 'react';
import {Typography, Box, Link} from "@material-ui/core";

const Footer = () => {
    return (
        <Box p={4}>
        <Typography variant="body2" align="center">
          {"This statistics for COVID-19 get updated every 8 hours via "}
          <Link color="primary" href="https://github.com/mathdroid/covid-19-api">
            mathdroid API
          </Link>
          {", which accesses data by "}
          <Link
            color="primary"
            href="https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
          >
            John Hopkins University CSSE
          </Link>
          . <br />
          {"Site Source "}
          <Link href="https://github.com/netmagik">
            https://github.com/netmagik
          </Link>
          .
        </Typography>
      </Box>
    )
}

export default Footer;
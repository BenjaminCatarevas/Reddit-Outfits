import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

export default function About() {
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.root}>
        <Typography align="center" variant="h5" component="h3">
          Background and Thank-yous
        </Typography>
        <Typography align="center" component="p">
          Created by <strong>Benjamin Catarevas</strong>
        </Typography>
        <Typography align="center" component="p">
          Special thanks to the following:
        </Typography>
        <Typography align="center" component="p">
          <strong>n1c</strong>, for the original idea
        </Typography>
        <Typography align="center" component="p">
          <strong>Keshav Patel</strong>, for continuous support and help
        </Typography>
      </Paper>
    </div>
  );
}

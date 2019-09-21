import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

export default function Error() {
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.root}>
        <Typography align="center" variant="h5" component="h2">
          Error: Information not found.
        </Typography>
      </Paper>
    </div>
  );
}

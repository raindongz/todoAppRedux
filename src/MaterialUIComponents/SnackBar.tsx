import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps, Color } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";

interface snackBarInterface {
  severity: Color;
  snackBarOpen: boolean;
  handleSnackBarClose: () => void;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props: snackBarInterface) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.snackBarOpen}
        autoHideDuration={6000}
        onClose={props.handleSnackBarClose}
      >
        <Alert onClose={props.handleSnackBarClose} severity={props.severity}>
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
}

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Button, DialogContentText } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import React, { useState } from "react";

interface ListAlreadyExistInterface {
  listExistWindowOpen: boolean;
  listExistWindowClose: () => void;
}
function ListAlreadyExistHandler(props: ListAlreadyExistInterface) {
  return (
    <div>
      <Dialog
        open={props.listExistWindowOpen}
        onClose={props.listExistWindowClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          List name already exist
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please consider another List name
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={props.listExistWindowClose}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default ListAlreadyExistHandler;

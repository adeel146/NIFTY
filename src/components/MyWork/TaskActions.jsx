import React, { useState } from "react";
import { Button, Modal, Backdrop, Fade } from "@mui/material";
import { Delete, Person, Assignment } from "@mui/icons-material";

function TaskActions({ isOpen, handleCloseModal }) {
  return (
    <div>
      <Modal open={isOpen} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={isOpen}>
          <div className="slim-modal">
            <div className="slim-modal-header">
              <h2>Options</h2>
              <Button onClick={handleCloseModal}>Close</Button>
            </div>
            <div className="slim-modal-content">
              <div className="action-icon">
                <Delete fontSize="large" />
                <span>Delete Task</span>
              </div>
              <div className="action-icon">
                <Person fontSize="large" />
                <span>Assign User</span>
              </div>
              <div className="action-icon">
                <Assignment fontSize="large" />
                <span>Complete Task</span>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default TaskActions;

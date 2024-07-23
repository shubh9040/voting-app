import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

// Styled form components
const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const PopupForm = ({ open, handleClose, type, onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    console.log("handleSubmit called");
    console.log("firstName : ", firstName === "");
    console.log("lastName : ", lastName === "");
    console.log("dateOfBirth : ", dateOfBirth === "");
    let dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (firstName === "" && lastNameError === "" && dateOfBirth === "") {
      setFirstNameError("First name is required");
      setLastNameError("Last name is required");
      setError("Date of birth must be at least 18 years ago.");
      toast.warn("Please fill all empty fileds.");

      return;
    }

    if (firstName === "") {
      setFirstNameError("First name is required");
      setLastNameError("");
      setError("");
      toast.warn("Please fill all empty fileds.");
      return;
    }

    if (lastName === "") {
      setLastNameError("Last name is required");
      setFirstNameError("");
      setError("");
      toast.warn("Please fill all empty fileds.");
      return;
    }

    if (age < 18 || dateOfBirth === "") {
      setError("Date of birth must be at least 18 years ago.");
      setLastNameError("");
      setFirstNameError("");
      toast.warn("Please fill all empty fileds.");
      return;
    }

    onSubmit({ firstName, lastName, dateOfBirth });
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setError("");
  };

  const onFormCancel = () => {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setError("");
    setFirstNameError("");
    setLastNameError("");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add {type}</DialogTitle>
      <DialogContent>
        <StyledFormControl fullWidth>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {firstNameError && (
            <Typography color="error" variant="body2">
              {firstNameError}
            </Typography>
          )}
        </StyledFormControl>

        <StyledFormControl fullWidth>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {lastNameError && (
            <Typography color="error" variant="body2">
              {lastNameError}
            </Typography>
          )}
        </StyledFormControl>

        <StyledFormControl fullWidth>
          <TextField
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </StyledFormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onFormCancel();
            handleClose();
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupForm;

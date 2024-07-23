import React, { useEffect, useState } from "react";
import { BASE_URL } from "./constants/constant";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import { styled, createGlobalStyle } from "@mui/material/styles";
import { styled, createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import PopupForm from "./popupform/PopupForm";

// Global style to hide the scrollbar
const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

// Styled container for the tables
const Container = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  gap: "20px", // Adds space between the tables and dropdowns
  padding: "20px",
  maxWidth: "1200px", // Limits the maximum width of the container
  margin: "0 auto", // Centers the container horizontally
  height: "300px",
  overflow: "hidden",
  position: "relative",
});

// Scrollable content div to enable scrolling within the container
const ScrollableContent = styled("div")({
  overflowY: "auto",
  width: "100%",
  height: "100%",
  paddingRight: "20px", // Adjust the padding to avoid cutting off content
  boxSizing: "content-box", // Ensure padding doesn't affect overall width
});

// Styled table for better appearance
const StyledTable = styled(Table)({
  minWidth: 200,
});

const DataTable = ({ title, data, columns, onAddClick }) => (
  <TableContainer component={Paper}>
    <Typography variant="h6" gutterBottom>
      {title}
      <IconButton
        color="primary"
        style={{ float: "right" }}
        onClick={onAddClick}
      >
        <AddIcon />
      </IconButton>
    </Typography>
    <StyledTable>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column}>{column}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row._id}>
            {title === "Voters" ? (
              <>
                <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                <TableCell>{row.isVoted ? "V" : "X"}</TableCell>
              </>
            ) : (
              <>
                <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                <TableCell>{row.votes}</TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  </TableContainer>
);

const Vote = () => {
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedVoterId, setSelectedVoterId] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [popupType, setPopupType] = useState("");

  const fetchAllVoters = async () => {
    try {
      const method = `api/voter/all-voter`;
      const response = await fetch(`http://localhost:4003/${method}`);
      if (response.ok) {
        const data = await response.json();
        setVoters(data.data);
        console.log("Voters: ", data.data);
      } else {
        console.log("Error fetching voters: ", response.statusText);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const fetchAllCandidates = async () => {
    try {
      const method = `api/candidates/get-all`;
      const response = await fetch(`http://localhost:4003/${method}`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.data);
        console.log("Candidates: ", data.data);
      } else {
        console.log("Error fetching candidates: ", response.statusText);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Check if both IDs are selected
      if (!selectedVoterId || !selectedCandidateId) {
        toast.warn("Please select both a voter and a candidate.");
        return;
      }

      // Prepare the request payload
      const payload = {
        voterId: selectedVoterId,
        candidateId: selectedCandidateId,
      };

      // Send the PATCH request
      const response = await fetch(`http://localhost:4003/api/voter/vote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is OK
      if (response.ok) {
        const result = await response.json();
        console.log("API Response: ", result);
        toast.success("Vote successfully cast!");
        fetchAllVoters();
        fetchAllCandidates();
        // Clear the selected values
        setSelectedVoterId("");
        setSelectedCandidateId("");
      } else {
        console.log("Error response: ", response);
        toast.warn("Already voted!");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.warn("Error casting vote.");
    }
  };

  const handleAddClick = (type) => {
    setPopupType(type);
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  const handleAddSubmit = async (data) => {
    try {
      const endpoint =
        popupType === "Voter" ? "api/voter/signup" : "api/candidates/create";
      const response = await fetch(`http://localhost:4003/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${popupType} added:`, result);
        if (popupType === "Voter") {
          fetchAllVoters();
        } else {
          fetchAllCandidates();
        }
        handlePopupClose();
      } else {
        console.log(`Error adding ${popupType}:`, response.statusText);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllVoters();
    fetchAllCandidates();
  }, []);

  return (
    <>
      <GlobalStyle />
      <div>
        <Typography variant="h4" p={2}>
          Voting App
        </Typography>
        <Container>
          <ScrollableContent>
            <DataTable
              title="Voters"
              data={voters}
              columns={["First Name", "Voted"]}
              onAddClick={() => handleAddClick("Voter")}
            />
          </ScrollableContent>
          {/* <ScrollableContent> */}
            <DataTable
              title="Candidates"
              data={candidates}
              columns={["First Name", "Votes"]}
              onAddClick={() => handleAddClick("Candidate")}
            />
          {/* </ScrollableContent> */}
        </Container>
        <div>
          <Typography variant="h4" p={2}>
            Vote
          </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <FormControl style={{ width: "40%" }}>
            <InputLabel id="voter-select-label">Select Voter</InputLabel>
            <Select
              labelId="voter-select-label"
              value={selectedVoterId}
              onChange={(e) => setSelectedVoterId(e.target.value)}
              label="Select Voter"
            >
              {voters.map((voter) => (
                <MenuItem key={voter._id} value={voter._id}>
                  {`${voter.firstName} ${voter.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ width: "40%" }}>
            <InputLabel id="candidate-select-label">
              Select Candidate
            </InputLabel>
            <Select
              labelId="candidate-select-label"
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              label="Select Candidate"
            >
              {candidates.map((candidate) => (
                <MenuItem key={candidate._id} value={candidate._id}>
                  {`${candidate.firstName} ${candidate.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ marginTop: "20px", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
      <PopupForm
        open={openPopup}
        handleClose={handlePopupClose}
        type={popupType}
        onSubmit={handleAddSubmit}
      />
    </>
  );
};

export default Vote;

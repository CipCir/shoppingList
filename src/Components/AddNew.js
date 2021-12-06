import { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";

import Autocomplete from "@mui/material/Autocomplete";
function toTitleCase(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

export default function AddNew({
  saveNew,
  closeEdit,
  availableCats,

  availableProds,
}) {
  const [categ, setCateg] = useState(availableCats[0]);
  const [disableCat, setDisableCat] = useState(false);
  const [showAlert, setShowAlert] = useState({ nume: false, categ: false });

  const [desc, setDesc] = useState("");
  const [q, setQ] = useState(1);

  const [dropName, setDropName] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (dropName === inputValue && dropName !== "") {
      setDisableCat(true);
      setCateg(availableProds.find((el) => el.Nume === dropName).Cat);
    } else {
      setDisableCat(false);
      setCateg("");
    }
  }, [dropName, inputValue, availableProds]);

  const handleChange = (event) => {
    setCateg(event.target.value);
  };

  const changeDesc = (event) => {
    setDesc(event.target.value);
  };
  const changeQ = (event) => {
    setQ(event.target.value);
  };

  const handleOk = () => {
    let hasErr = false;
    // onClose(value);
    const updated = {
      Id: null,
      Nume: toTitleCase(inputValue),
      Description: desc,
      Q: q,
      Cat: categ,
      reUse: false,
      isAvailable: true,
    };

    if (categ === "") {
      setShowAlert((prevVal) => {
        return { ...prevVal, categ: true };
      });
      hasErr = true;
    } else {
      setShowAlert((prevVal) => {
        return { ...prevVal, categ: false };
      });
    }
    if (inputValue === "") {
      setShowAlert((prevVal) => {
        return { ...prevVal, nume: true };
      });
      hasErr = true;
    } else {
      setShowAlert((prevVal) => {
        return { ...prevVal, nume: false };
      });
    }
    if (hasErr) {
      return null;
    }
    //update existing or add new item
    if (dropName === inputValue) {
      updated.reUse = true;
      updated.Id = availableProds.find((el) => el.Nume === dropName).id;
      updated.Nume = dropName;
      saveNew(updated);
    } else {
      saveNew(updated);
    }

    closeEdit();
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%" } }}
      maxWidth="xs"
      open={true}
      fullWidth={true}
    >
      <DialogTitle>Adaugare</DialogTitle>
      <DialogContent dividers>
        {showAlert.nume && (
          <Alert variant="outlined" severity="error">
            Numele este necesar
          </Alert>
        )}
        <Autocomplete
          freeSolo
          disablePortal
          id="combo-box-demo"
          value={dropName}
          onChange={(event, newValue) => {
            setDropName(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={availableProds.map((prd) => prd.Nume)}
          renderInput={(params) => <TextField {...params} label="Nume" />}
          sx={{ marginBottom: "10px" }}
          popper={{ backgroundColor: "red" }}
        />

        <TextField
          fullWidth
          multiline
          id="descriere"
          label="Descriere"
          value={desc}
          onChange={changeDesc}
          variant="outlined"
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          fullWidth
          id="Quant"
          label="Cantitate"
          value={q}
          onChange={changeQ}
          variant="outlined"
          sx={{ marginBottom: "10px" }}
        />
        {showAlert.categ && (
          <Alert variant="outlined" severity="error">
            Categoria e necesara
          </Alert>
        )}
        <FormControl fullWidth disabled={disableCat}>
          <InputLabel id="demo-simple-select-label">Categorie</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={categ}
            label="Categorie"
            onChange={handleChange}
          >
            {availableCats.map((cat) => {
              return (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={closeEdit}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

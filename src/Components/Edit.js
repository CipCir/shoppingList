import { useState } from "react";
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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Edit({
  itm,
  cat,
  saveEdit,
  closeEdit,
  availableCats,
  deleteProd,
}) {
  const [categ, setCateg] = useState(cat);

  const [nume, setNume] = useState(itm.Nume);
  const [desc, setDesc] = useState(itm.Description);
  const [q, setQ] = useState(itm.Q);

  const handleChange = (event) => {
    setCateg(event.target.value);
  };
  const changeNume = (event) => {
    setNume(event.target.value);
  };
  const changeDesc = (event) => {
    setDesc(event.target.value);
  };
  const changeQ = (event) => {
    setQ(event.target.value);
  };

  const handleOk = () => {
    // onClose(value);
    const updated = {
      Nume: nume,
      Description: desc,
      Q: q,
      Cat: categ,
      reUse: false,
    };

    //update existing or add new item

    saveEdit(updated);

    closeEdit();
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={true}
      fullWidth={true}
    >
      <DialogTitle>{itm.Nume}</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Nume"
          value={nume}
          onChange={changeNume}
          variant="outlined"
          sx={{ marginBottom: "10px" }}
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

        <FormControl fullWidth>
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
        <IconButton aria-label="delete" onClick={deleteProd}>
          <DeleteIcon />
        </IconButton>
        <Button autoFocus onClick={closeEdit}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

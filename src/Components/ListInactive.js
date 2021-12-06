import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import Chip from "@mui/material/Chip";

export default function ListInactive({
  cat,
  prod,
  toggleStatus,

  makeSelected,
}) {
  const handleSelection = () => {
    makeSelected(cat, prod);
  };
  return (
    <ListItem
      disablePadding
      dense
      divider
      sx={{
        bgcolor: "primary.light",
        color: "black",
      }}
    >
      <Chip
        label={prod.Q}
        size="small"
        variant="outlined"
        onClick={() => toggleStatus(cat, prod.id, prod.Status)}
        sx={{
          marginRight: "10px",
          marginLeft: "5px",
          background: "whitesmoke",
        }}
      />

      <ListItemButton dense onClick={handleSelection}>
        <ListItemText
          primary={prod.Nume}
          className="inactive-item"
          secondary={prod.Description}
          secondaryTypographyProps={{
            color: "black",
            fontStyle: "italic",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

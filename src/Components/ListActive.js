import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { grey, red } from "@mui/material/colors";

export default function ListActive({
  cat,
  prod,
  toggleStatus,
  toggleAvailable,
  makeSelected,
}) {
  const shopCartColor = prod.isAvailable ? grey[400] : red[600];
  const handleSelection = () => {
    makeSelected(cat, prod);
  };
  return (
    <ListItem
      disablePadding
      divider
      sx={{
        bgcolor: "primary.main",
        color: "white",
        borderRadius: "5px",
      }}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="comments"
          onClick={() => toggleAvailable(cat, prod.id, prod.isAvailable)}
        >
          <RemoveShoppingCartIcon sx={{ color: shopCartColor }} />
        </IconButton>
      }
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
          secondary={prod.Description}
          secondaryTypographyProps={{
            color: "#1bff61",
            fontStyle: "italic",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

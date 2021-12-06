import { useEffect, useState } from "react";

import "./App.css";
// import { db } from "./myFirebase";
import "./myFirebase";
import { getDatabase, ref, onValue, update } from "firebase/database";

// import Container from "@mui/material/Container";

// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function App() {
  const [shopList, setShopList] = useState({});
  // const [catList, setCatList] = useState([]);

  const db = getDatabase();

  const handleToggle = (cat, prod, status) => () => {
    const reference = ref(db, "Categs/" + cat + "/" + prod);
    console.log(cat, prod);

    update(reference, { Status: !status });
  };

  useEffect(() => {
    const reference = ref(db, "Categs/");
    onValue(reference, (snapshot) => {
      let newDB = {};
      Object.keys(snapshot.val()).forEach((cat) => {
        newDB[cat] = [];
        Object.keys(snapshot.val()[cat]).forEach((prodID) => {
          newDB[cat].push({ id: prodID, ...snapshot.val()[cat][prodID] });
        });
      });
      console.log("newDB", newDB);
      // console.log("snapshot", snapshot.val());

      setShopList(newDB);
    });
  }, [db]);
  return (
    <div className="mainContainer">
      {Object.keys(shopList).map((itm) => {
        return (
          <Box key={"D" + itm}>
            {shopList[itm].filter((itm) => !itm.Status).length > 0 && (
              <div>{itm}</div>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
              {shopList[itm]
                .filter((itm) => !itm.Status)
                .map((prod) => {
                  return (
                    <>
                      <FormControlLabel
                        key={prod.id}
                        label={prod.Nume}
                        control={
                          <Checkbox
                            size="small"
                            checked={prod.Status}
                            onChange={handleToggle(itm, prod.id, prod.Status)}
                          />
                        }
                      >
                        <div className="Qcont">{prod.Q}</div>
                      </FormControlLabel>
                    </>
                  );
                })}
            </Box>
          </Box>
        );
      })}
      <hr />
      {Object.keys(shopList).map((itm) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
            {shopList[itm]
              .filter((itm) => itm.Status)
              .map((prod) => {
                return (
                  <FormControlLabel
                    key={prod.id}
                    label={prod.Nume}
                    control={
                      <Checkbox
                        size="small"
                        checked={prod.Status}
                        onChange={handleToggle(itm, prod.id, prod.Status)}
                      />
                    }
                  />
                );
              })}
          </Box>
        );
      })}
    </div>
  );

  // return (
  //   <Container maxWidth="sm">
  //     <nav aria-label="main mailbox folders">
  //       <List
  //         dense
  //         sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
  //       >
  //         {Object.keys(shopList).map((itm) => {
  //           return (
  //             <>
  //               {shopList[itm].length > 0 && (
  //                 <ListItem disablePadding key={"D" + itm}>
  //                   <ListItemText primary={itm} />
  //                 </ListItem>
  //               )}
  //               {shopList[itm]
  //                 .filter((itm) => !itm.Status)
  //                 .map((prod) => {
  //                   return (
  //                     <ListItem disablePadding key={prod.id}>
  //                       <ListItemButton
  //                         role={undefined}
  //                         onClick={handleToggle(itm, prod.id, prod.Status)}
  //                         dense
  //                       >
  //                         <ListItemIcon>
  //                           <Checkbox
  //                             edge="start"
  //                             checked={prod.Status}
  //                             tabIndex={-1}
  //                             disableRipple
  //                             inputProps={{ "aria-labelledby": prod.id }}
  //                           />
  //                         </ListItemIcon>
  //                         <ListItemText primary={prod.Nume} />
  //                       </ListItemButton>
  //                     </ListItem>
  //                   );
  //                 })}
  //             </>
  //           );
  //         })}
  //       </List>
  //     </nav>
  //     <Divider />
  //     <nav aria-label="main mailbox folders">
  //       <List
  //         dense
  //         sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
  //       >
  //         {Object.keys(shopList).map((itm) => {
  //           return (
  //             <>
  //               {shopList[itm]
  //                 .filter((itm) => itm.Status)
  //                 .map((prod) => {
  //                   return (
  //                     <ListItem disablePadding key={"c" + prod.id}>
  //                       <ListItemButton
  //                         role={undefined}
  //                         onClick={handleToggle(itm, prod.id, prod.Status)}
  //                         dense
  //                       >
  //                         <ListItemIcon>
  //                           <Checkbox
  //                             edge="start"
  //                             checked={prod.Status}
  //                             tabIndex={-1}
  //                             disableRipple
  //                             inputProps={{ "aria-labelledby": prod.id }}
  //                           />
  //                         </ListItemIcon>
  //                         <ListItemText primary={prod.Nume} />
  //                       </ListItemButton>
  //                     </ListItem>
  //                   );
  //                 })}
  //             </>
  //           );
  //         })}
  //       </List>
  //     </nav>
  //   </Container>
  // );
}

export default App;

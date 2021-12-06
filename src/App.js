import React, { useEffect, useState } from "react";

import "./App.css";
import "./myFirebase";
import {
  getDatabase,
  ref,
  onValue,
  update,
  remove,
  set,
  push,
} from "firebase/database";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ListActive from "./Components/ListActive";
import ListInactive from "./Components/ListInactive";
import Edit from "./Components/Edit";
import AddNew from "./Components/AddNew";

import Alert from "@mui/material/Alert";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";

const db = getDatabase();

function App() {
  const [shopList, setShopList] = useState({});

  const [showEdit, setShowEdit] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [detailsCat, setDetailsCat] = useState();
  const [detailsProd, setDetailsProd] = useState({});
  const [updLog, setUpdLog] = useState([]);

  const [categs, setCategs] = useState([]);
  const [eProds, setEProds] = useState([]);
  const [activeProd, setActiveProd] = useState([]);

  useEffect(() => {
    const reference = ref(db, "Categs/");

    onValue(reference, (snapshot) => {
      //resets
      setCategs([]);
      setEProds([]);

      let newDB = {};
      const availblPrj = [];
      const availblCats = [];
      const remainingPrj = [];
      Object.keys(snapshot.val()).forEach((cat) => {
        availblCats.push(cat);
        newDB[cat] = [];
        Object.keys(snapshot.val()[cat]).forEach((prodID) => {
          newDB[cat].push({ id: prodID, ...snapshot.val()[cat][prodID] });
          if (snapshot.val()[cat][prodID].Status) {
            availblPrj.push({
              Cat: cat,
              id: prodID,
              Nume: snapshot.val()[cat][prodID].Nume,
            });
          } else {
            remainingPrj.push(prodID);
          }
        });
      });
      setActiveProd(remainingPrj);
      setShopList(newDB);
      setCategs(availblCats);
      setEProds(availblPrj);
    });
  }, []);

  function updateDB(cat, id, payload) {
    const reference = ref(db, "Categs/" + cat + "/" + id);
    update(reference, payload);

    const undoVal = {};
    Object.keys(payload).forEach((key) => {
      undoVal[key] = !payload[key];
    });

    setUpdLog((oldVal) => {
      return [...oldVal, { cat, id, undo: { ...undoVal } }];
    });
  }
  const undoAction = () => {
    if (updLog.length === 0) {
      return false;
    }
    const lastAction = updLog[updLog.length - 1];

    const reference = ref(db, "Categs/" + lastAction.cat + "/" + lastAction.id);
    update(reference, { ...lastAction.undo });
    setUpdLog((oldVal) => {
      return [...oldVal.slice(0, oldVal.length - 1)];
    });
  };

  const handleAvailable = (cat, id, isAvailable) => {
    updateDB(cat, id, { isAvailable: !isAvailable });
  };
  const handleToggle = (cat, id, status) => {
    updateDB(cat, id, { Status: !status });
  };

  const handleSaveEdit = ({ Nume, Description = "", Q, Cat }) => {
    //edit existing category
    if (Cat === detailsCat) {
      const reference = ref(db, "Categs/" + Cat + "/" + detailsProd["id"]);
      update(reference, { Nume, Description, Q });
    } else {
      // move to new category
      const updatedProd = { ...detailsProd, Nume, Description, Q };
      remove(ref(db, "Categs/" + detailsCat + "/" + detailsProd["id"])).then(
        () => {
          set(ref(db, "Categs/" + Cat + "/" + detailsProd["id"]), {
            ...updatedProd,
          }).then(() => {
            setDetailsProd({});
            setDetailsCat();
            setShowEdit(false);
          });
        }
      );
    }
  };

  const handleDelete = () => {
    remove(ref(db, "Categs/" + detailsCat + "/" + detailsProd["id"]));
    setShowEdit(false);
  };

  const selectEdit = (cat, prod) => {
    setDetailsCat(cat);
    setDetailsProd(prod);
    setShowEdit(true);
  };
  const handleAddNew = (pay) => {
    const { Cat, Id, reUse, ...fields } = pay;

    if (reUse) {
      update(ref(db, "Categs/" + Cat + "/" + Id), {
        ...fields,
        Status: false,
        isAvailable: true,
      });
    } else {
      push(ref(db, "Categs/" + Cat), fields);
    }
  };
  return (
    <Container maxWidth="sm" sx={{ marginTop: "5px" }}>
      {activeProd.length === 0 && (
        <Box>
          <Alert severity="success">Ai luat tot !!!</Alert>
        </Box>
      )}
      <Box>
        {Object.keys(shopList).map((itm) => {
          return (
            <div key={itm}>
              {shopList[itm].filter((itm) => !itm.Status).length > 0 && (
                <>
                  <div>{itm}</div>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      margin: "5px auto",
                      color: "white",
                    }}
                  >
                    {shopList[itm]
                      .filter((itm) => !itm.Status)
                      .map((prod) => {
                        return (
                          <ListActive
                            key={prod.id}
                            prod={prod}
                            cat={itm}
                            toggleStatus={handleToggle}
                            toggleAvailable={handleAvailable}
                            makeSelected={selectEdit}
                          />
                        );
                      })}
                  </List>
                </>
              )}
            </div>
          );
        })}
      </Box>
      <hr />
      <Box>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            margin: "5px auto",
            color: "white",
          }}
        >
          {Object.keys(shopList).map((itm) => {
            return (
              <React.Fragment key={itm}>
                {shopList[itm]
                  .filter((itm) => itm.Status)
                  .map((prod) => {
                    return (
                      <ListInactive
                        key={prod.id}
                        prod={prod}
                        cat={itm}
                        toggleStatus={handleToggle}
                        makeSelected={selectEdit}
                      />
                    );
                  })}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
      {showEdit && (
        <Edit
          itm={detailsProd}
          cat={detailsCat}
          availableCats={categs}
          saveEdit={handleSaveEdit}
          closeEdit={() => setShowEdit(false)}
          deleteProd={handleDelete}
        />
      )}
      {showNew && (
        <AddNew
          availableCats={categs}
          availableProds={eProds}
          saveNew={handleAddNew}
          closeEdit={() => setShowNew(false)}
        />
      )}

      <Fab
        color="primary"
        aria-label="add"
        size="small"
        sx={{ position: "fixed", bottom: 5, right: 5 }}
        elevation={3}
        onClick={() => setShowNew(true)}
      >
        <AddIcon />
      </Fab>
      <Fab
        aria-label="add"
        color="secondary"
        size="small"
        sx={{
          position: "fixed",
          bottom: 5,
          left: 5,

          backgroundColor: "Teal",
        }}
        elevation={3}
        onClick={undoAction}
      >
        <UndoIcon />
      </Fab>
    </Container>
  );
}

export default App;

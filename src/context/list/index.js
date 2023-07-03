import React, { useState, useEffect, useContext } from "react";

const ListContext = React.createContext({});
const ListConsumer = ListContext.Consumer;

const ListProvider = ({ children }) => {
  const [list, setList] = useState(null);
  const [openSideBar, setOpenSideBar] = useState(false);

  const setListItems = (item) => {
    localStorage.setItem("currentConverstion", JSON.stringify(item));
    setList(item);
  };

  useEffect(() => {
    let currCons = JSON.parse(localStorage.getItem("currentConverstion"));
    if (currCons) {
      setList(currCons);
    }
  }, []);

  return (
    <ListContext.Provider
      value={{ setListItems, list, openSideBar, setOpenSideBar }}
    >
      {children}
    </ListContext.Provider>
  );
};

export { ListContext, ListConsumer, ListProvider };


import React, { useState } from "react";

import Select, { ItemType } from './component/select'

import './app.css';

const list = [
  { label: "option01", value: "01" },
  { label: "option02", value: "02" },
  { label: "option03", value: "03" },
  { label: "option04", value: "04" },
  { label: "option05", value: "05" },
  { label: "option06", value: "06" }
];

function App() {
  const [products, setProducts] = useState<ItemType[]>([]);
  console.log("---products----", products);

  const itemToString = (item: ItemType) => (item ? item.label : "");

  const handleChange = (selectedItems: ItemType[]) => {
    console.log({ selectedItems });
    setProducts(selectedItems);
  };

  return (
    <div className="App">
      <Select
        items={list}
        onChange={handleChange}
        itemSelected={products || []}
        itemToString={itemToString}
      />
    </div>
  );
}

export default App;

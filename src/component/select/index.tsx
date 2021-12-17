import React, { useState, useRef, useEffect } from "react";
import Downshift from "downshift";

import './select.css'

export type ItemType = {
    label: string
    value: string
}

interface SelectProps  {
  items: ItemType[]
  itemSelected?: ItemType[]
  onChange?: (selectedItems: ItemType[]) => void;
  itemToString?: (item: any) => string;
}


const Select = ({ onChange, items, itemSelected = [], itemToString, ...rest }: SelectProps) => {
  const [selectedItems, setSelectedItems] = useState<ItemType[]>(itemSelected|| []);
  
  const ref = useRef(null);

 
 
  const getItems = (value: string) =>
  value ? 
      items.filter(
        item =>
          selectedItems.indexOf(item) < 0 &&
          item?.label?.toLowerCase().startsWith(value.toLowerCase()),
      ) :  items


  useEffect(() => {
      if(onChange && selectedItems) {
      onChange(selectedItems || []);
  }
  }, [selectedItems]);

  const stateReducer = (state: any, changes: any) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true,
          inputValue: ""
        };
      default:
        return changes;
    }
  };

  const removeItem = (item: ItemType) => {
 
    setSelectedItems((prevState) => prevState.filter((i) => i !== item));
  };

  const addSelectedItem = (item:ItemType) => {
 
    setSelectedItems((prevState) => [...prevState, item]);
  };

  const handleSelection = (selectedItem:any) => {
    if (selectedItems.includes(selectedItem)) {
      removeItem(selectedItem);
    } else {
      addSelectedItem(selectedItem);
    }
  };

  const getRemoveButtonProps = ({ onClick, item ,...props } : {item: ItemType, onClick?: any}) => {
    return {
      onClick: (e: any) => {
         onClick && onClick(e);
        e.stopPropagation();
        removeItem(item);
      },
      ...props
    };
  };

  return (
    <Downshift
      {...rest}
      stateReducer={stateReducer}
      onChange={handleSelection}
      itemToString={itemToString}
      selectedItem={null}
    >
      {({
        getInputProps, 
        getToggleButtonProps,
        getMenuProps,
        isOpen,
        inputValue,
        getItemProps,
        highlightedIndex,
        toggleMenu
      }) => (
        <div className="selectStyle">
          {selectedItems &&
            selectedItems.length > 0 &&
            selectedItems.map((item) => (
              <li key={item.value}>
                <div>
                  <span>{item.label}</span>
                  <button {...getRemoveButtonProps({ item })}>𝘅</button>
                </div>
              </li>
            ))}
          <div className="select">
            <div
            className="select__input"
            role='button'
            onClick={() => {
              toggleMenu(); 
            }} 
             >
              <input
                {...getInputProps({ ref: ref })}
                placeholder={
                  selectedItems && selectedItems.length < 1
                    ? "Select a value"
                    : ""
                }
              />
            <button
              {...getToggleButtonProps({
                onClick(event) {
                  event.stopPropagation();
                }
              })}
            >
            {isOpen ? 'X' : '+'}
            </button>
          </div>

          <ul className='select__options' {...getMenuProps({ open: isOpen })}> 
            {isOpen
              ? getItems(inputValue || '')?.map((item, index) => (
                  <li
                    key={item.value}
                    {...getItemProps({ item, index, open: isOpen})}
                  >
                    {item.label}
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
      )}
    </Downshift>
  );
};

export default Select;
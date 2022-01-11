import React, { useState, useRef, useEffect } from 'react';
import Downshift from 'downshift';
import clsx from 'clsx';

import './select.css';

export type ItemType = {
  label: string;
  value: string;
};

interface SelectProps {
  items: ItemType[];
  itemSelected?: ItemType[];
  onChange?: (selectedItems: ItemType[]) => void;
  itemToString?: (item: any) => string;
  isMultiple?: boolean;
}

const Select = React.forwardRef(
  ({ onChange, items, itemSelected = [], itemToString, isMultiple, ...rest }: SelectProps, ref) => {
    const [selectedItems, setSelectedItems] = useState<ItemType[]>(itemSelected || []);

    const inputRef = useRef(null);

    const getItems = (value: string) =>
      value
        ? items.filter(
            (item) =>
              selectedItems.indexOf(item) < 0 &&
              item?.label?.toLowerCase().startsWith(value.toLowerCase()),
          )
        : items;

    useEffect(() => {
      if (onChange && selectedItems) {
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
            inputValue: state?.inputValue,
          };
        case Downshift.stateChangeTypes.blurInput:
          return { inputValue: '' };
        default:
          return changes;
      }
    };

    const removeItem = (item: ItemType) => {
      if (item?.value === 'all') setSelectedItems([]);
      else
        setSelectedItems((prevState) =>
          prevState.filter((i) => i?.value !== 'all' && i?.value !== item?.value),
        );
    };

    const addSelectedItem = (item: ItemType) => {
      if (item?.value === 'all') setSelectedItems([...items]);
      else setSelectedItems((prevState) => (isMultiple ? [...prevState, item] : [item]));
    };

    const includeItem = ({ list, value }: { list: ItemType[]; value: string }) => {
      const index = list.findIndex((elt: ItemType) => elt?.value === value);
      if (index < 0) return false;
      return true;
    };

    const handleSelection = (selectedItem: any) => {
      if (includeItem({ list: selectedItems, value: selectedItem?.value })) {
        removeItem(selectedItem);
      } else {
        addSelectedItem(selectedItem);
      }
    };

    const getRemoveButtonProps = ({
      onClick,
      item,
      ...props
    }: {
      item: ItemType;
      onClick?: any;
    }) => {
      return {
        onClick: (e: any) => {
          onClick && onClick(e);
          e.stopPropagation();
          removeItem(item);
        },
        ...props,
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
          toggleMenu,
        }) => (
          <div className="select__wrapper">
            <div className="select">
              <div
                className="select__input"
                role="button"
                onClick={() => {
                  toggleMenu();
                }}
              >
                <input
                  {...getInputProps({ ref: inputRef })}
                  placeholder={selectedItems && selectedItems.length < 1 ? 'Select a value' : ''}
                />
                <button
                  {...getToggleButtonProps({
                    onClick(event) {
                      event.stopPropagation();
                    },
                  })}
                >
                  {isOpen ? <>&#11165;</> : <>&#11167;</>}
                </button>
              </div>

              <ul className="select__options" {...getMenuProps({ open: isOpen })}>
                {isOpen &&
                  getItems(inputValue || '')?.map((item, index) => (
                    <li
                      className={clsx(
                        'option',
                        highlightedIndex === index && 'option-active',
                        includeItem({ list: selectedItems, value: item?.value }) &&
                          'option-selected',
                      )}
                      key={`option-${item.value}`}
                      {...getItemProps({ item, index })}
                    >
                      {item.label}
                    </li>
                  ))}
              </ul>
            </div>
            {selectedItems && selectedItems.length > 0 && (
              <ul className="selected">
                {selectedItems.map((item) => (
                  <li className="selected__item" key={`selected-${item.value}`}>
                    <span>{item.label}</span>
                    <button {...getRemoveButtonProps({ item })}> &#10005;</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Downshift>
    );
  },
);

export default Select;

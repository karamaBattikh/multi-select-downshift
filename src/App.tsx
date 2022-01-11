import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import Select, { ItemType } from './component/select';
import { list, list2 } from './data';

import './app.css';

const prepareData = (list: any[]): ItemType[] =>
  list?.map((item: any) => ({ label: item?.label, value: item?.value })) || [];

type FormType = {
  options: ItemType[];
  option: ItemType[];
};

function App() {
  const { handleSubmit, control } = useForm<FormType>({
    defaultValues: {
      options: [list[1], list[3]] || [],
      option: [list2[1]] || [],
    },
  });

  const itemToString = (item: ItemType) => (item ? item.value : '');

  const onSubmit = (values: FormType) => console.log('*-values-*', values);

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="select_multiple">
          <h2>Select Multiple Item</h2>
          <Controller
            name="options"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                items={prepareData(list) || []}
                isMultiple
                onChange={onChange}
                itemSelected={prepareData(value) || []}
                itemToString={itemToString}
              />
            )}
          />
        </div>
        <hr />
        <div className="select_one">
          <h2>Select One Item</h2>
          <Controller
            name="option"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                items={prepareData(list2) || []}
                onChange={onChange}
                itemSelected={value || []}
                itemToString={itemToString}
              />
            )}
          />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;

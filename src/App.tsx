
import React from "react";
import { useForm, Controller } from "react-hook-form";

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

const prepareData = (list: any[]): ItemType[] => list?.map((item: any) => ({ label: item?.label, value: item?.value })) || []

type FormType = {
  products: ItemType[]
}

function App() {
  const { handleSubmit, control } = useForm<FormType>({
    defaultValues: {
      products: [list[0], list[3]] || []
    }
  });

  const itemToString = (item: ItemType) => (item ? item.value : "");

  const onSubmit = (values: FormType) => console.log('*-values-*', values);

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>

        <Controller
          name="products"
          control={control}
          defaultValue={[list[0], list[3]]}
          render={
            ({ field: { onChange, value } }) =>
              <Select
                items={prepareData(list) || []}
                onChange={onChange}
                itemSelected={prepareData(value) || []}
                itemToString={itemToString}
              />
          }
        />

        <input type="submit" />
      </form>
    </div>
  );
}

export default App;

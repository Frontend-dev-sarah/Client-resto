import React from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from 'src/resources/common/colors';
import { ProductOption } from 'src/models/products';

type PickerSelectProps = {
  value: number;
  onChange: Function;
  items: ProductOption[];
};

function PickerSelect({ value, onChange, items }: PickerSelectProps) {
  function renderItem(item: ProductOption) {
    return <Picker.Item key={item.id} label={item.name} value={item.id} />;
  }
  function renderList() {
    return items.map(item => renderItem(item));
  }
  return (
    <Picker
      selectedValue={value}
      style={[styles.container]}
      onValueChange={itemValue => onChange(itemValue)}
      itemStyle={{ color: Colors.white }}
      mode="dropdown" // dropdown | dialog
    >
      {renderList()}
    </Picker>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.veryLightGrey,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%'
  }
});

export default PickerSelect;

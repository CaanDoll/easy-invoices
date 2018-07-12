export const datePickerOption = {
  disabledDate: date => {
    return date.valueOf() > Date.now();
  },
};

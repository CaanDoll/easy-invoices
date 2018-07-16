exports.dateFilter = value => {
  if (value) {
    const d = new Date(parseInt(value));
    const date = {
      Y: d.getFullYear(),
      M: d.getMonth() > 8 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1),
      D: d.getDate() > 9 ? d.getDate() : '0' + d.getDate(),
      h: d.getHours() > 9 ? d.getHours() : '0' + d.getHours(),
      m: d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes(),
      s: d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds(),
    };
    const t = date.Y + '-' + date.M + '-' + date.D + ' ' + date.h + ':' + date.m + ':' + date.s;
    return t;
  }
  return '';
};

exports.getRegexp = type => {
  switch (type) {
    case 'money':
      return /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    default:
      return null;
  }
};

exports.getDatePickerOpt = () => {
  return {
    disabledDate: date => {
      return date.valueOf() > Date.now();
    },
  };
};

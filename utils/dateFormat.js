const dateFormat = (timestamp, separator = ' ', format = 'yyyy-mm-dd hh:mm:ss') => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const formattedDate = format
    .replace('yyyy', year)
    .replace('mm', month.toString().padStart(2, '0'))
    .replace('dd', day.toString().padStart(2, '0'))
    .replace('hh', hour.toString().padStart(2, '0'))
    .replace('mm', minute.toString().padStart(2, '0'))
    .replace('ss', second.toString().padStart(2, '0'));

  return formattedDate.replace(' ', separator);
};

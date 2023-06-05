// https://jsfiddle.net/LYteC/4/
const decodeEntities = (str: string) => {
  // this prevents any overhead from creating the object each time
  const element = document.createElement('div');

  if (str && typeof str === 'string') {
    // strip script/html tags
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
    element.innerHTML = str;
    str = element.textContent || '';
    element.textContent = '';
  }

  return str;
};

export default decodeEntities;

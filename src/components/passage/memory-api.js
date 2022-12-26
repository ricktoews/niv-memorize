import axios from 'axios';

const API_URL = 'https://niv.toews-api.com/rest.php/';
const getPassage = (book, chapter) => {
  var url = API_URL + (chapter ? `getpassage/${book}/${chapter}` : `getpassage/${book}`);
  return axios.get(url)
    .then(res => {
      return res.data;
    }); 
  
}

const getTitles = (str) => {
  var url = API_URL + `titlematches/${str}`;
  return axios.get(url)
    .then(res => {
      return res.data;
    });
}

export { getPassage, getTitles };

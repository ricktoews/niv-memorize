import axios from 'axios';

const API_URL = 'http://memorize.toewsweb.net/rest.php/';
const getPassage = (book, chapter) => {
  var url = API_URL + `getpassage/${book}/${chapter}`;
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

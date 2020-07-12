import axios from "axios";
import url from "../strapi/URL";
import setupUser from "../strapi/setupUser"

async function loginUser ({ email, password}) {
 const reponse = await axios.post(`${url}/auth/local`,
 {
     identifier : email,
     password
 })
.catch(error => console.log(error));
 
if (reponse) {
    setupUser(reponse);
}
return reponse;
  
}
export default loginUser;
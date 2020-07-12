import axios from "axios";
import url from "../strapi/URL";
import setupUser from "../strapi/setupUser"

async function registerUser ({ email, password, username
}) {
    const reponse = await axios.post(`${url}/auth/local/register`,{
        username,
        email,
        password
    })
    .catch(error => console.log(error));
    if (reponse){
        setupUser(reponse);
    }
    return reponse;
}
export default registerUser;
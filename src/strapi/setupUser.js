
import {setStorageUser, setUser } from "../stores/user";

function setupUser(reponse) {
    const {jwt} = reponse.data;
    const {username} = reponse.data.user;
    const user = {username,jwt};
    setStorageUser(user);
    setUser(user);
}

export default setupUser;


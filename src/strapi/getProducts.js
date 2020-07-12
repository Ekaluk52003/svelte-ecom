import url from "./URL"
export default async ( ) => {
    const reponse = await fetch(`${url}/products`).catch
    (error => 
        console.log(error)
    );
    const products = await reponse.json();
    if (products.error) {
        return null;
    }
    console.log(reponse );
    return products; 

};
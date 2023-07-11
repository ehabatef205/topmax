import axios from "../axios";

const addOrder=async(products, phone, country, firstName, lastName, address, city, zipCode)=>{
    return  axios.post('/order_items/create', {
        products: products,
        phone: phone,
        country: country,
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        zipCode: zipCode
    }
    ,{headers:{authorization:localStorage.getItem("Authorization")}}
    )
}
export default addOrder
import axios from "../axios";

const addOrder=async(products, phone, country, firstName, lastName, address, city, zipCode, payment, totalPrice)=>{
    return  axios.post('/order_items/create', {
        products: products,
        phone: phone,
        country: country,
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        zipCode: zipCode,
        payment: payment,
        totalPrice: totalPrice
    }
    ,{headers:{authorization:localStorage.getItem("Authorization")}}
    )
}
export default addOrder
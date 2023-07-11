import axios from "../axios";

const addCart=async(product_id, quantity)=>{
    return  axios.post('/cart_items/create', {
        product_id: product_id,
        quantity: quantity
    }
    ,{headers:{authorization:localStorage.getItem("Authorization")}}
    )
}
export default addCart
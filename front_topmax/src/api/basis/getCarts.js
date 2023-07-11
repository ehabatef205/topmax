import axios from "../axios";

const getCarts=async()=>{
    return  axios.get('/cart_items/'
    ,{headers:{authorization:localStorage.getItem("Authorization")}}
    )
}
export default getCarts
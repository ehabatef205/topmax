import {React, useState, useRef, useEffect} from "react";
import { FaSpinner } from 'react-icons/fa';
import { Container } from "react-bootstrap";
import {ViewCart} from "../components/section/homecards";
import "../components/section/slider.css";
import { Nav2 } from "../components/Navs/Nav2";
import getCarts from "../api/basis/getCarts"
import addOrder from "../api/basis/addOrder"
import getProduct from "../api/basis/product"
import removeCart from "../api/basis/removeCart"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CartPage() {
    const [carts,setCarts]=useState([])

  const [loading,setLoading]=useState(false)

  const [viewInputs,setView]=useState(false)

  const [viewButton ,setViewButton]=useState(false)

  const [products,setProducts]=useState([])

  const [priceProducts,setPriceProducts]=useState([])

  const [payment,setPayment]=useState("")
  
  const [valueButton, setValueButton] = useState("اطلب اوردر")

  var allPrice = 0

  const phone = useRef(null); 
  const country = useRef(null);
  const firstName = useRef(null); 
  const lastName = useRef(null);
  const address = useRef(null); 
  const city = useRef(null);
  const zipCode = useRef(null);

  useEffect(()=>{
      if(localStorage.getItem("Authorization") !== null){
        setLoading(true)
      getCarts(localStorage.getItem("Authorization")).then(async(res)=>{
        setLoading(false)
        
        setCarts(res.data)
      }).catch((error) => {
        setLoading(false)
      })
      }
    }
    ,[])

    const addProducts = async() => {
      for(var i = 0; i < carts.length; i++){
        const product = {product_id:carts[i].product_id, quantity: carts[i].quantity}
        setProducts(products => [...products, product]) 
        await getProduct(carts[i].product_id).then(async (product1)=>{
          allPrice = allPrice + (product1.data.price * carts[i].quantity)
        })
      }

      setPriceProducts(allPrice)
    }

    
    const add = async() => {
      if(viewInputs === false){
          if(carts.length !== 0){
            addProducts().then(res => {
              setView(true)
              setValueButton("اختر طريقة الدفع")
            })
          }else{
            toast.warning("Cart is empty", {
              position: toast.POSITION.TOP_RIGHT
            })
          }
      }else{
        if(payment === "cash"){
          await addOrder(products, phone.current.value, country.current.value, firstName.current.value, lastName.current.value, address.current.value, city.current.value, zipCode.current.value, payment, priceProducts).then(async res => {
            console.log(res.data)
          })
          window.location.reload(false)
        }else{
          if(phone.current.value !== "" && country.current.value !== "" && firstName.current.value !== "" && lastName.current.value !== "" && address.current.value !== "" && city.current.value !== "" && zipCode.current.value !== ""){
            setViewButton(true)
            setPayment("online")
            setView(false)
            setValueButton("اطلب اوردر")
          }else{
            toast.warning("Please complete all inputs", {
              position: toast.POSITION.TOP_RIGHT
            })
          }
        }
      }
    }

    const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    event.preventDefault(); // Prevent the default behavior of the input change event
    setInputValue(event.target.value);
  };

    const initialOptions = {
      clientId: "ATO_-FjHuv2JTyECiX5TclFq-q3FUmAHEWW43BitksJd7w11Ft_rJauiRXcRZDdX37ZGoRche9BrvFKy",
      currency: "USD",
      intent: "capture",
    };

    const view = () => {
      setView(true)
    }

    const createOrder = (data) => {
      // Order is created on the server and the order id is returned
      return fetch("http://5.183.9.124:7011/my-server/create-paypal-order", {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          products: {
              cost: priceProducts,
            },
        }),
      })
      .then((response) => response.json())
      .then((order) => order.id);
    };
  
    const onApprove = (data) => {
       // Order is captured on the server and the response is returned to the browser
       return fetch("http://5.183.9.124:7011/my-server/capture-paypal-order", {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      })
      .then((response) => response.json()).then(async(order) => {
        if(order.status === "COMPLETED"){
          await addOrder(products, phone.current.value, country.current.value, firstName.current.value, lastName.current.value, address.current.value, city.current.value, zipCode.current.value).then(async res => {
            console.log(res.data)
          })
          window.location.reload(false)
        }
      });
    };

    const handleSelection = (e) => {
      setPayment(e.target.value)
      console.log(e.target.value)
    }

  return (
    <>
    <Nav2></Nav2>
    <div
      className="cart_page"
      style={{ height: "fit-content", position: "relative", top: "61px", backgroundColor: "#e7e7e7"}}
    >
      <Container className="my-4  " style={{ justifyContent: "center" }}>
        <div>
          <div className="" style={{ height: "fit-content" }}>
          <Container
          className="my-4"
          style={{ justifyContent: "center", backgroundColor: "white" }}
        >
          <div className="d-flex justify-content-around flex-wrap">
            {loading? <FaSpinner icon="spinner" className="icon_pulse" style={{fontSize: "50px"}}/> 
   : <>{carts?.map((cart, index) => <ViewCart key={index} id={cart.product_id} cart_id={cart._id} quantity={cart.quantity} />)}</>}
          </div>
        </Container>
        {viewInputs && (<div>
          <input
            ref={country}
            style={inputText5}
            placeholder="الدولة"
            type="text"
          />
          <input
            ref={phone}
            style={inputText5}
            placeholder="رقم الهاتف"
            type="phone"
          />
          <input
            ref={lastName}
            style={inputText5}
            placeholder="الاسم الاخير"
            type="text"
          />
          <input
            ref={firstName}
            style={inputText5}
            placeholder="الاسم الاول"
            type="text"
          />
          <input
            ref={address}
            style={inputText5}
            placeholder="العنوان بالتفصيل"
            type="text"
          />
          <input
            ref={city}
            style={inputText5}
            placeholder="المحافظة"
            type="text"
          />
          <input
          ref={zipCode}
            style={inputText5}
            placeholder="الرقم البريدي"
            type="text"
          />
          <div style={divPrice}>السعر الكلي: ${priceProducts}</div>
        </div>)}
        {viewButton? <><div style={divPrice}>السعر الكلي: ${priceProducts}</div><div style={divPayment}>
            <label style={{padding: "10px"}}>
              <input type="radio" value="online" checked={payment === "online"} onChange={handleSelection}/>
              Online
            </label>
            <label style={{padding: "10px"}}>
              <input type="radio" value="cash" checked={payment === "cash"} onChange={handleSelection}/>
              Cash
            </label>
          </div></> : <></>}
       {payment === "online"? <PayPalScriptProvider options={initialOptions}>
       <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
      </PayPalScriptProvider> : <div className=" my-1 w-100  d-md-grid ">
                  <span className=" my-2 h-100 " style={{ textAlign: "center" }}>
                    <button
                      className="btn text-light my-3 h-50 w-100"
                      onClick={() => {add()}}
                      style={{ backgroundColor: "blue" }}
                      disabled={localStorage.getItem("Authorization") === null}
                    >
                      {valueButton}
                    </button>
                  </span>
                </div>}
          </div>
        </div>
      </Container>
    </div>
    <ToastContainer />
    </>
  );
}

const inputText5 = {
  border: "1px solid #000",
  borderRadius: "15px",
  width: "calc(50% - 20px)",
  padding: "10px",
  marginTop: "20px",
  textAlign: "right",
  margin: "10px"
}

const divPrice = {
    borderRadius: "15px",
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    textAlign: "center",
    margin: "10px",
}

const divPayment = {
  borderRadius: "15px",
  width: "100%",
  padding: "10px",
  marginTop: "20px",
  textAlign: "center",
  margin: "10px",
  display: "inline-block"
}

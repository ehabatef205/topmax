import express from "express";
import cors from 'cors'
import * as paypal from "./paypal-api.js";
const {PORT = 8888} = process.env;

const app = express();

const corsOptions ={
  origin: "*", 
  credentials:true,          
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json({limit: '50mb'}));

app.post("/my-server/create-paypal-order", async (req, res) => {
  try {
    const order = await paypal.createOrder(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/my-server/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await paypal.capturePayment(orderID);
    console.log(captureData.status)
    res.json(captureData);
  } catch (err) {
    console.log(err)
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});
import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        const itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      console.log('Response from server:', response.data);

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error: " + response.data.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("There was an error placing the order:", error);
      alert("Error: " + error.message || "Unknown error occurred");
    }
  };


  useEffect(()=>{
    if(!token){
        navigate('/cart')
    }
    else if(getTotalCartAmount===0)
      {
        navigate('/cart')
      }

  },[token])

  return (
    <form onSubmit={handlePlaceOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <input
          required
          name="zipcode"
          onChange={onChangeHandler}
          value={data.zipcode}
          type="text"
          placeholder="Zip-code"
        />
        <input
          required
          name="country"
          onChange={onChangeHandler}
          value={data.country}
          type="text"
          placeholder="Country"
        />
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
        </div>
        <div className="cart-total-details">
          <p>Subtotal</p>
          <p>${getTotalCartAmount()}</p>
        </div>
        <hr />
        <div className="cart-details">
          <p>Delivery Fee</p>
          <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <b>Total</b>
          <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
        </div>
      </div>
      <button type="submit">PROCEED TO PAYMENT</button>
    </form>
  );
};

export default PlaceOrder;

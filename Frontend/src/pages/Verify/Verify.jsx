import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { StoreContext } from '../../context/StoreContext';
import { Navigate, useNavigate } from 'react-router-dom';


const Verify = () => {

    const [useSearchParams, setSearchParams] = useSearchParams();
    const sucess = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const {url} = useContext(StoreContext);
    const navgigate = useNavigate();


    const verifyPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId });
            if (response.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Error verifying payment", error);
            navigate("/"); // Handle error by redirecting to home
        }
    };
    
    useEffect( ()=>{
        verifyPayment ();
    })

  return (
    <div>
      <div className="verify">
        <div className="spinner">

        </div>
      </div>
    </div>
  )
}

export default Verify

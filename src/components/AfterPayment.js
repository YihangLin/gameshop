import { useParams, useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const AfterPayment = () => {
  const stripe_id = useParams().sid;
  let history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/');
    }, 5000);
    return () => clearTimeout(timer);
  },[history])

  return ( 
    <div style={{ textAlign:'center', minHeight:'80vh' }}>
      <h2>Order#: {stripe_id}</h2>
      <h2>Thank you for your purchase!</h2>
      <h3>Return to homepage after 5 seconds...</h3>
    </div>
  );
}
 
export default AfterPayment;
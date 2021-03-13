import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

const useFirestoreOrders = (id) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    //get cart and wishlist from firestore
    const cartInfo = projectFirestore.collection('orders').doc(id)
      .onSnapshot((snap) => {
        if(snap.exists){
          setDocs(snap.data().orders);
        } else {
          setDocs([]);
        }
      });

    return() => cartInfo();
  }, [id])
  return ([ docs ]);
}
 
export default useFirestoreOrders;


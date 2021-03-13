import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

const useFirestore = (collection, id) => {
  const [docs, setDocs] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    //get cart and wishlist from firestore
    const cartInfo = projectFirestore.collection(collection).doc(id)
      .onSnapshot((snap) => {
        if((snap.exists) && (snap.data().list !== undefined)){
          setDocs(snap.data().list);
          setTotal(snap.data().total);
        } else {
          setDocs([]);
          setTotal(0);
        }
      });

    return() => cartInfo();
  }, [collection, id])
  return ([ docs, total ]);
}
 
export default useFirestore;


import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

const useFirestore = (collection) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    //get collection from firestore
    const gamesInfo = projectFirestore.collection(collection)
      .onSnapshot((snap) => {
        let documents = [];
        snap.forEach((doc) => {
          documents.push({...doc.data(), id: doc.id});
        });
        setDocs(documents);
      });

    return() => gamesInfo();
  }, [collection])

  return ({ docs });
}
 
export default useFirestore;


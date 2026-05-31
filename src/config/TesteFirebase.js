import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/Firebase';

async function testarFirebase() {
  try {
    await addDoc(collection(db, 'Teste'), {
      mensagem: 'Firebase conectado!'
    });

    console.log('Sucesso');
  } catch (error) {
    console.log(error);
  }
}

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc,doc, collection, where, query,getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDIQOsIcGbhmaNqMAY5Oz2XMi3suR-_LVc",
  authDomain: "chat-app-gs-d79e0.firebaseapp.com",
  projectId: "chat-app-gs-d79e0",
  storageBucket: "chat-app-gs-d79e0.appspot.com",
  messagingSenderId: "989256224119",
  appId: "1:989256224119:web:c88659d1b91bc29f5d6572"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

const signup=async (username,email,password)=>{
   try{
      const res=await createUserWithEmailAndPassword(auth,email,password);
      const user=res.user;
      await setDoc(doc(db,"users",user.uid),{
        id:user.uid,
        username:username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hey, There i am using chat app",
        lastSeen:Date.now()   
      })

      await setDoc(doc(db,"chats",user.uid),{
        chatsData:[]
      })
   }catch(error){
      console.error(error)
      toast.error(error.code.split('/')[1].split('-').join(" "));
   }
}

const login=async (email,password)=>{
   try{
     await signInWithEmailAndPassword(auth,email,password);
   }catch(error){
     console.error(error);
     toast.error(error.code.split('/')[1].split('-').join(" "));
   }
}


const logout=async ()=>{
  try {
     await signOut(auth);
  } catch (error) {
    console.error(error);
     toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const resetPass=async (email)=>{
  if(!email){
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef=collection(db,'users');
    const q=query(userRef,where("email","==",email));
    const querySnap=await getDocs(q);
    if(!querySnap.empty){
        await sendPasswordResetEmail(auth,email);
        toast.success("Reset Email Sent");
    }else{
      toast.error("Email doesn't exists");
    }
  } catch (error) {
    console.error(error);
    toast.error(error)
  }
}
export {signup,login,logout,auth,db,resetPass}
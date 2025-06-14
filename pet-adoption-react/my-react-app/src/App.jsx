import Form from "./components/Form";
import {useState} from "react";

export default function App(){
  const [formData,setFormData] = useState({
    petName:"",
    type:"",
    breed:"",
    name:"",
    email:"",
    phone:""
  });
  const [submittedForms,setSubmittedForms] = useState([]);

  function handleSubmit(){
    setSubmittedForms([...submittedForms,formData]);
    setFormData({
      petName:"",
      type:"",
      breed:"",
      name:"",
      email:"",
      phone:""
    });
  }

  return(
    <>
    <Header />
    <Form formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
    </>
    
  )
} 

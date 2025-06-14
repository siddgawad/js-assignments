import { useState } from "react";

export default function Form(){
  const [formData, setFormData] = useState({
    petName: "",
    type: "",
    breed: "",
    name:"",
    email: "",
    phone: ""
  });
  const [submittedForms, setSubmittedForms] = useState([]);
  
  function handleChange(e){
    setFormData({...formData,[e.target.petName]:e.target.value});
    setFormData({...formData,[e.target.type]:e.target.value});
    setFormData({...formData,[e.target.breed]:e.target.value});
    setFormData({...formData,[e.target.name]:e.target.value});
    setFormData({...formData,[e.target.email]:e.target.value});
    setFormData({...formData,[e.target.phone]:e.target.value});

  }
  function handleSubmit() {
  
    setSubmittedForms([...submittedForms, formData]);
  
 
    setFormData({
      petName:"",
      type:"",
      breed:"",
      name: "",
      email: "",
      phone: ""
    });
  }
  

  return(
    <div>
      <h2>Pet Name</h2>
      <input placeholder="Pet Name" value={formData.petName} onChange={handleChange} />
      <h2>Pet Type</h2>
      <input placeholder="Pet Type" value={formData.type} onChange={handleChange} />
      <h2>Breed</h2>
      <input placeholder="Breed" value={formData.breed} onChange={handleChange} />
      <h2>Your Name</h2>
      <input placeholder="Your Name" value={formData.name} onChange={handleChange} />
      <h2>Email</h2>
      <input placeholder="Email" value={formData.email} onChange={handleChange} />
      <h2>Phone</h2>
      <input placeholder="Phone" value={formData.phone} onChange={handleChange}/>
      <button onClick={handleSubmit}>Submit</button>

    </div>
    
  )
}
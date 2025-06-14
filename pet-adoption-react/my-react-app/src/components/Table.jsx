

export default function Table({submittedForms}){


    return(
        <>
        <div>
     
                <table>
                    <thead>
                    <tr>
                        <th>Pet Name
                        </th>
                        <th>
                            Pet Type
                        </th>
                        <th>
                            Breed
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Email
                        </th>
                        <th>Phone</th>
                    </tr>
                    </thead>
                    <tbody>
                        {submittedForms.map((t,index)=>(
                               <tr key={index}>
                               <td>{t.petName}</td>
                               <td>{t.type}</td>
                               <td>{t.breed}</td>
                               <td>{t.name}</td>
                               <td>{t.email}</td>
                               <td>{t.phone}</td>
                           </tr>
                        ))}
                 
                    </tbody>
             
                </table>
        </div>
        </>
    )
}
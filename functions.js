const tools = (() => {
    return {
        login: () => {

        },
        auth: () => {

        },
        buildTable: (role, container, docs) => {
            if (role == 'user'){
                container.innerHTML = ""
                container.innerHTML += 
                    `<tr>
                        <th colspan="1" width="200" style="border-width: 1px">Name</th>
                        <th colspan="1" width="189" style="border-width: 1px">Email</th>
                        <th colspan="1" width="100" style="border-width: 1px">Phone</th>
                        <th colspan="1" width="150" style="border-width: 1px">Area</th>
                    </tr>`

                    docs.forEach( (doc) => {

                        container.innerHTML += 
                        `<tr>
                           <td style="border-width: 1px"> ${doc.data().name}</td> 
                           <td style="border-width: 1px"> ${doc.data().email}</td> 
                           <td style="border-width: 1px"> ${doc.data().phone}</td> 
                           <td style="border-width: 1px"> ${doc.data().area}</td>
                        </tr>`
            })
        } else if (role == 'admin' || role == 'reviewer'){
            container.innerHTML = ""
            container.innerHTML += 
                 `<tr>
                    <th colspan="1" width="200" style="border-width: 1px">Name</th>
                    <th colspan="1" width="189" style="border-width: 1px">Email</th>
                    <th colspan="1" width="100" style="border-width: 1px">Phone</th>
                    <th colspan="1" width="150" style="border-width: 1px">Area</th>
                    <th colspan="1" width="150" style="border-width: 1px">Manage</th>  
                </tr>`
            
            if(role == 'admin'){
                
            }
        }
    }
}
})();

export default tools

const tools = (() => {
    return {
        login: () => {

        },
        auth: () => {

        },

        buildTable:(role, container, docs) => {
            console.log(role);
            
            container.innerHTML = ""
            
            container.innerHTML += 
            
                `<tr>
                    <th colspan="1" width="200" style="border-width: 1px">Name</th>
                    <th colspan="1" width="189" style="border-width: 1px">Email</th>
                    <th colspan="1" width="100" style="border-width: 1px">Phone</th>
                    <th colspan="1" width="150" style="border-width: 1px">Area</th>
                </tr>`;

                
            if (role == 'admin' || role == 'reviewer'){
                container.rows[0].innerHTML += `<th colspan="1" width="150" style="border-width: 1px">Manage</th>  `
            }
            let i = 0
            docs.forEach( (doc) => {
                    container.innerHTML += 
                    `<tr>
                        <td style="border-width: 1px"> ${doc.data().name}</td> 
                        <td style="border-width: 1px"> ${doc.data().email}</td> 
                        <td style="border-width: 1px"> ${doc.data().phone}</td> 
                        <td style="border-width: 1px"> ${doc.data().area}</td>
                        
                    </tr>`
                    if (role == 'admin'){
                        container.rows[i + 1].innerHTML += `<td style="border-width: 1px">
                        <button class='editBtn' data-id="${doc.id}" href="#"
                        data-bs-toggle="modal" data-bs-target="#addContModal">Edit</button>
                        <button class='delBtn' data-id="${doc.id}">Delete</button>
                        <button class='deactBtn' data-id="${doc.id}">Deactivate</button></td> `
                    }

                    if (role == 'reviewer'){
                        container.rows[i + 1].innerHTML +=
                        `<td style="border-width: 1px">
                           <button class='editBtn' data-id="${doc.id}" href="#"
                           data-bs-toggle="modal" data-bs-target="#addContModal">Edit</button>
                           <button class='actBtn' data-id="${doc.id}">Activate</button></td>`
                    }

                    i++
            })
                
        }
  
}
})();

export default tools

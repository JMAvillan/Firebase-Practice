//Select element from html
const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

//create element and render cafe
function renderCafe(doc){
    //Create elements that are going to be displayed
    let li = document.createElement('li');
    let name  = document.createElement('span');
    let city  = document.createElement('span');
    let cross = document.createElement('div');

    //Set the attribute of li to the id of the document
    //This will make it easier to reference later on.
    li.setAttribute('data-id', doc.id);
    
    //Get the names and city variables their names from the database
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x'

    //Attach the variables to the list item
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);
    //Attacch the list item to the list
    cafeList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (evt)=>{
        /*When dispatched in a tree, invoking this method prevents event from
         reaching any objects other than the current object.*/ 
        evt.stopPropagation();
        //Grabs the id of the list item (li) where the cross its located at
        //evt.target = what triggered the event
        //target.parentElement = where that target resides at 
        //data-id was set to be the unique document id from firestore
        let id = evt.target.parentElement.getAttribute('data-id');
        db.collection('cafe').doc(id).delete();
    } )
}



/* Asyncronous method (nth time to complete) so it cannot be assigned
   directly to a variable. We add then() at the end for a 
   callout function - when it finishes executing the get() it calls the
   function specified in then(). */
// As argument we pass a snapshot of the database at that moment in time,
// which is the return value from the get().
// Snapshot - a representation of different data inside the collection
// db.collection('cafe').where('city', '==', 'New York').orderBy('name', 'desc').get().then((snapshot)=>{
//     //console.log(snapshot.docs);
//     snapshot.docs.forEach(doc => {
//         //console.log(doc.data());
//         renderCafe(doc);
//     });
// })

//real-time listener
db.collection('cafe').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        //console.log(change.doc.data())
        if(change.type == 'added')
            renderCafe(change.doc);
        else if (change.type == 'removed'){
            //Selects the list item stored in cafeList that has the same id 
            //as the doc that was changed
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
    }
    })
})

//saving data
form.addEventListener('submit', (evt) =>{
    //this is added because by default a button refreshes the page
     evt.preventDefault();
     db.collection('cafe').add({
         name: form.name.value,
         city: form.city.value,
     })

     //reset forms
     form.name.value = '';
     form.city.value = '';
})


const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

//create element and render cafe
function renderCafe(doc){
    
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';
    

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);


    //deleting data
    cross.addEventListener('click', (evt) => {
        evt.stopPropagation();
        let id = evt.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();                
        //console.log(id);
    });
}


//Get docs from cafes collection
// db.collection('cafes').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     })
// });

//real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        switch (change.type) {
            case 'added':
                renderCafe(change.doc);
                break;
            case 'removed':
                let lic = cafeList.querySelector('[data-id=' + change.doc.id + ']');
                cafeList.removeChild(lic);
                break;
            case 'modified':
                let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
                li.children[0].innerHTML = change.doc.data().name;
                li.children[1].innerHTML = change.doc.data().city;
                break;        
            default:
                break;
        }
    });
});

//saving data
form.addEventListener('submit', (evt) => {
    
    evt.preventDefault();

    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });

    form.name.value = '';
    form.city.value = '';

    

    form.name.focus();
});

//delete data


const infoList = document.querySelector('#info-list');
const form = document.querySelector('#add-info-form');

function renderInfo(doc){
    let li = document.createElement('li');
    let information = document.createElement('span');
    let name = document.createElement('span');
    let cross = document.createElement('div');
    

    li.setAttribute('data.id', doc.id);
    name.textContent = doc.data().name;
    information.textContent = doc.data().information;
    cross.textContent = 'X';

    li.appendChild(name);
    li.appendChild(information);
    li.appendChild(cross);

    infoList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data.id');
        db.collection('infos').doc(id).delete();
    });
}

//getting data
//db.collection('infos').orderBy('information').get().then((snapshot) => {
   // snapshot.docs.forEach(doc => {
       // renderInfo(doc);
    //});
//}); 

//saving data
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    db.collection('infos').add({
        name: form.name.value,
        information: form.information.value,
    });
    form.name.value = '';
    form.information.value = '';
});

//real time listening
db.collection('infos').orderBy('information').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderInfo(change.doc);            
        } else if (change.type == 'removed') {
            let li = infoList.querySelector('[data-id=' + change.doc.id + ']');
            infoList.removeChild(li);
        }
    });
})
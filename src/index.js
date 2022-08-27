import axios from 'axios';
const ul = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');

let items;

const renderItems = ()=> {
  const html = items.map( item => {
    return `
      <li class='${ item.purchased ? 'purchased':'needs'}'>
        ${ item.name }
        <span>(${ new Date(item.updatedAt).toLocaleString()})</span>
        <br />
        <button data-id='${ item.id }'>x</button>
        <button data-action='toggle' data-id='${ item.id }' ${item.needed ? 'disabled': ''}>Mark as Needed</button>
        <button data-action='toggle' data-id='${ item.id }' ${item.purchased ? 'disabled': ''}>Mark as Purchased</button>
      </li>
    `;
  }).join('');
  ul.innerHTML = html;
};

ul.addEventListener('click', async(ev)=> {
  const target = ev.target;
  const id = target.getAttribute('data-id')*1;
  if(target.tagName === 'BUTTON'){
    if(target.getAttribute('data-action') === 'toggle'){
      const item = items.find(item => item.id === id);
      const response = await axios.put(`/api/items/${id}`, {
        purchased: !item.purchased
      });
      const updated = response.data;
      items = items.map(item => item.id === updated.id ? updated: item);
      renderItems();
    }
    else {
      await axios.delete(`/api/items/${id}`);
      items = items.filter(item => item.id !== id);
      renderItems();
    }
  }
});

form.addEventListener('submit', async(ev)=> {
  ev.preventDefault();
  try {
    const item = { name: input.value };
    const response = await axios.post('/api/items', item);
    items.push(response.data);
    renderItems();
  }
  catch(ex){
    console.log(ex);
  }
});

const setup = async()=> {
  try {
    /*
    const response = await axios.get('/api/items');
    items = response.data;
    */
    items = (await axios.get('/api/items')).data;
    renderItems();

  }
  catch(ex){
    console.log(ex);
  }
};


setup();

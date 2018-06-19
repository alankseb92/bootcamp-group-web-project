(function createMainPage(){

    const app = document.getElementById('root');
    const logo = document.createElement('img');
    logo.src = 'img/logo1.jpg';
    
    const container = document.createElement('div');
    container.setAttribute('class','container');
    container.setAttribute('id','container');
    
    const character = document.createElement('div');
    character.setAttribute('class','character');
    character.setAttribute('id','character');
    character.style.display = 'none';
    
    const preLoader = document.createElement('div');
    preLoader.setAttribute('id','preLoader');
    preLoader.setAttribute('align','center');
    preLoader.setAttribute('style','height: 200px;');
    
    const loader = document.createElement('div');
    loader.setAttribute('class','loader');
    loader.setAttribute('id','loader');
    loader.style.display = 'none';
    
    const spam = document.createElement('spam');
    spam.setAttribute('class','temp');
    spam.setAttribute('id','temp');
    spam.setAttribute('offset','0');
    spam.setAttribute('limit','50');
    spam.setAttribute('scroll','');
    
    preLoader.appendChild(loader);
    app.appendChild(logo);
    app.appendChild(spam);
    app.appendChild(container);
    app.appendChild(character);
    app.appendChild(preLoader);
    scrollBottom();
    loadApi(null,null);
})();  

function scrollBottom(){
    let loading = false;
    window.onscroll = function(){
        if(character.style.display == 'none'){
            if((window.innerHeight+this.window.scrollY) >= this.document.body.scrollHeight){
                if(loading == false){
                    loader.style.display = '';
                    loading = true;
                    loadApi(null,null);
                }else{
                }
            }else{
                loading = false;
                // loader.style.display = 'none';
            }
        }
    }
};

function loadApi(type,value){
    const api = apiAddress(type,value);
    //open a new connection using the get resquest
    fetch(api)
    //convert the response to json
    .then(function(response){
        return response.json();
    })
    //work with the json information
    .then(function(data){
        fetchMarvelList(type,value,data)
    })
};

function apiAddress(type,value){
    const apiAddress = 'https://gateway.marvel.com/v1/public/';
    const getType = 'characters';
    const apikey = '766611ab74f4e8ab5d5b29c5f6e7d398';
    const hash = 'aea69f12a4b31ababd0c88e37b488550';
    const ts = '1';
    const limit = document.getElementById('temp').getAttribute('limit');
    const offset = document.getElementById('temp').getAttribute('offset');
    document.getElementById('temp').setAttribute('offset',parseInt(offset)+parseInt(limit));
    const orderBy = 'name';
    const nameStartsWith = '';
    let parameters = (type == 'character'?'/'+value:'');
    parameters += '?orderBy='+orderBy+'&limit='+limit+'&offset='+offset;
    
    const validation = '&apikey='+apikey+'&hash='+hash+'&ts='+ts;
    const api = apiAddress+getType+parameters+validation
    return api;
};

function fetchMarvelList(type,value,data){
    data = data.data.results;
    for(var i in data){
        createCard(type,i,data);
    }
    createListener(type,value);
};

function createCard(type,i,data){
    const card = `
    <div class="card" id=${(type=='character'?'char'+data[i].id:data[i].id)}>
    <h1>${data[i].name}</h1>
    <img src=${data[i].thumbnail.path}/portrait_xlarge.${data[i].thumbnail.extension}>
    <p>${data[i].description}</p>
    </div>
    `; // attention for this simbol: " ` "
    if(data[i].description.length > 0){
        if(type == 'character'){
            character.innerHTML = '';
            character.innerHTML += card;
            container.style.display = 'none';
            character.style.display = '';
            preLoader.style.display = 'none';
        }else{
            container.innerHTML += card;
        }
        loader.style.display = 'none';
    }
};

function createListener(type,value){
    if(type=='character'){
        document.getElementById('char'+value).addEventListener('click',function(){
            container.style.display = '';
            character.style.display = 'none';
            preLoader.style.display = '';
        });
    }else{
        var children = document.getElementsByClassName('card');
        for(var i = 0;i < children.length; i++){
            const idCharacter = document.getElementById(children[i].id);
            document.getElementById(idCharacter.id).addEventListener('click',function(){
                loadApi('character',idCharacter.id,null);
            });
        }
    }
};

// function clearElement(elementID){
//     document.getElementById(elementID).innerHTML = '';
// };

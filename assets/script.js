const gallery = document.querySelector(".gallery");
const filters = document.querySelector('.filters');
const buttonModalElement = document.querySelector('.modal__trigger')
const modalContentElement = document.querySelector('.modal_content')
const adminPanelElement = document.querySelector('.admin-panel')


let works = []
let categories = []
const isLogged = sessionStorage.getItem('token');

const getWorks = async () => {
    await fetch("http://localhost:5678/api/works")
.then(reponse => reponse.json())
.then(dataworks => { works.push(...dataworks)  
})
}
const getCategories = async () => {
    await fetch("http://localhost:5678/api/categories")
    .then(reponse => reponse.json())
    .then(dataCategories => { categories.push(...dataCategories) 
    })
}

const createWorks = (dataworks) => {
    dataworks.forEach(work => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        const figcaptionElement = document.createElement('figcaption');

        imgElement.src = work.imageUrl;
        figcaptionElement.textContent = work.title;

        figureElement.appendChild(imgElement)
        figureElement.appendChild(figcaptionElement)

        gallery.appendChild(figureElement)

      })
}

const deleteWork = async (id) => {
    return await fetch('http://localhost:5678/api/works/' + id, {
        method: 'delete',
        headers: {
            'Authorization': `Bearer ${isLogged}`
        }
    })
}

const updateUI = async () => {
    works = []
    gallery.innerHTML = ""
    modalContentElement.innerHTML = ""

    await getWorks()
    createWorks(works)
    createModalWorks(works)
}


const createModalWorks = (dataworks) => {
    dataworks.forEach(work => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        const trashIcon = document.createElement('img')

        imgElement.src = work.imageUrl;
        trashIcon.src = './assets/icons/trash.svg'
        trashIcon.alt = 'icone poubelle';
        trashIcon.classList.add('trash_icon');

        trashIcon.addEventListener('click', async () => {
            const response = await deleteWork(work.id)
            
            if (response.status === 204) {
                updateUI()
            }
        })

        figureElement.appendChild(imgElement);
        figureElement.appendChild(trashIcon);

        modalContentElement.appendChild(figureElement);

      })
}

const createButton = (category) => {
    const button = document.createElement('li')
    button.textContent = category.name

    if (category.id === 0) {
        button.classList.add('active')
    }

    button.addEventListener('click', () => {
        const allFilters = document.querySelectorAll('.filters li');
        allFilters.forEach(filter => filter.classList.remove('active'));

        button.classList.add('active')
        button
        if (category.id === 0) {
            gallery.innerHTML = "";
            return createWorks(works)
        }

        const filteredWorks = works.filter(work => work.categoryId === category.id);
        gallery.innerHTML = "";
        createWorks(filteredWorks)
        // filter()
    })

    filters.appendChild(button)
}

const handleFilters = (data) => {
    createButton({name: 'Tous', id: 0})
    data.forEach(category => createButton(category))
}

const init = async () => {

    await getWorks()
    await getCategories()

    createWorks(works)
    handleFilters(categories)
    createModalWorks(works)
}

init()


if (isLogged !== null) {
    buttonModalElement.style.display = 'inline-block';
    adminPanelElement.style.display = 'flex';
    filters.style.display = 'none';

    const loginAnchor = document.querySelector('.login')
    loginAnchor.textContent = "logout"

    loginAnchor.addEventListener('click', (e) => {
        e.preventDefault()
        sessionStorage.removeItem('token')
        location.assign('/login.html')
    })
}



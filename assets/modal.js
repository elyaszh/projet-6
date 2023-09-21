const modalBackground = document.getElementById("edit_modal");
const modalGallery = document.getElementById("gallery_photo");
const addImage = document.getElementById("add_picture");
const secondModalElement = document.querySelector('#second-modal')
const blackArrowElement = document.querySelector('#back-arrow')
const closeSecondeModal = document.querySelector('#close-seconde-modal')
const closeModal = document.querySelector('#close-modal')
const addPictureButtonelement = document.querySelector('#input_picture')
const workForm = document.querySelector('#new-work-form');

buttonModalElement.addEventListener("click", () => {
  modalBackground.style.display = "flex";
});

modalBackground.addEventListener('click', () => {
    modalBackground.style.display = 'none'
})

modalBackground.querySelector('.modal').addEventListener('click', (event) => {
    event.stopPropagation()
})

addImage.addEventListener('click', () => {
    modalBackground.style.display = 'none'
    secondModalElement.style.display = 'flex'
})

blackArrowElement.addEventListener('click', () => {
    modalBackground.style.display = 'flex'
    secondModalElement.style.display = 'none'
    cleanForm()
})

closeSecondeModal.addEventListener('click', () => {
    secondModalElement.style.display = 'none';
    cleanForm()
})

closeModal.addEventListener('click', () => {
    modalBackground.style.display = 'none';
})
 
const img = document.getElementById('work-image-box');
const titleImg = document.getElementById('new-work-title');
const category = document.getElementById('new-work-category');

addPictureButtonelement.addEventListener('change', function(event) {
    const addImage = event.target.files[0];

    const img = document.createElement('img')
    img.src = URL.createObjectURL(addImage)
    img.alt = 'fichier temporaire';
    img.classList.add('image_preview')

    document.querySelector('#image_modal_input i').style.display = 'none'
    document.querySelector('#image_modal_input label').style.display = 'none'
    document.querySelector('#image_modal_input span').style.display = 'none'
    document.querySelector('#image_modal_input').appendChild(img)

})

const postWork = async (data) => {
    return await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${isLogged}`,
        },
        body: data
    })
}

const cleanForm = () => {
    workForm.reset()
    document.querySelector('#image_modal_input i').style.display = 'block'
    document.querySelector('#image_modal_input label').style.display = 'flex'
    document.querySelector('#image_modal_input span').style.display = 'block'
    if (document.querySelector('#image_modal_input img')) {
        document.querySelector('#image_modal_input img').remove()
    }
}

workForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(workForm);
    const response = await postWork(data)
    
    if (response.status === 201) {
        updateUI()
        cleanForm()
        modalBackground.style.display = 'flex'
        secondModalElement.style.display = 'none'
    }

})
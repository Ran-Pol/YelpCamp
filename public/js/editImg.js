const Joi = require('joi')


const textTitle = document.querySelector('.deleteImageOnCLick');


async function consoleImage(event) {
    const imgClick = event.target;
    console.log(imgClick)
    const imageAlt = event.target.parentNode.children[0].alt;
    console.log(imageAlt)

}

// textTitle.addEventListener('click', consoleImage)

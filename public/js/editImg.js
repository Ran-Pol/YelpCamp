

async function runFunction(fileName) {
    const [id, imgIndex] = fileName.split(',')
    const send = {
        id: id,
        index: imgIndex
    };

    let response = await fetch(`/campgrounds/${id}/edit`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(send)
    });
    const data = await response.json();
    // console.log(data)
    const spanCount = document.querySelector('#numberImages');
    const divImgs = document.querySelector('#updateImgArray');
    divImgs.innerHTML = '';
    spanCount.textContent = data.count;
    if (data.count === 0) {
        divImgs.innerHTML = `<div class="carousel-item active image-area">
        <img src="/public/images/polished-diamond.png"
            class="d-block w-100" alt="Collection">
    </div>`;
    }
    updateArray(data.images, divImgs, id)

}

function updateArray(imgArr, groupImg, campId) {
    imgArr.forEach((img, index) => {
        //Create element
        const divElement = document.createElement('div');
        const imgElement = document.createElement('img');
        const aElement = document.createElement('a');

        //Set Attributes on divElement
        if (index === 0) {
            divElement.setAttribute('class', 'carousel-item image-area active')
        } else {
            divElement.setAttribute('class', 'carousel-item image-area');
        }

        //Set Attributes on imgElement and Append to Div
        imgElement.setAttribute('class', 'd-block w-100');
        imgElement.setAttribute('src', img.url);
        imgElement.setAttribute('alt', img.filename);
        divElement.appendChild(imgElement);

        //Set Attributes on aElement and Append to Div
        aElement.setAttribute('class', 'remove-image');
        aElement.setAttribute('onclick', `runFunction("${campId},${index}")`);
        aElement.setAttribute('style', "display: inline;");
        aElement.innerHTML = `&#215;`;
        divElement.appendChild(aElement);

        //add element to DOM
        groupImg.appendChild(divElement)
    })

}
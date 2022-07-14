

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
    const data = await response.text();
    console.log(data)
    const spanCount = document.querySelector('#numberImages');
    // spanCount.textContent = 100;

}

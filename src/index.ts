console.log("hello");

const image_types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

document.addEventListener('paste', async (e: any) => {
    if (navigator.clipboard === undefined){
        console.log('Cannot intercept paste, navigator.clipboard is undefined.');
        return;
    }

    if (e.clipboardData.types.includes("Files")){ // Does the clipboard being pasted contain files?
        console.log("it's an imageeee");
        for (let i = 0; i < e.clipboardData.items.length; i++){
            let transferItem = e.clipboardData.items[i];
            let file = e.clipboardData.files[i];
            if (!image_types.includes(transferItem.type)){
                continue; // not an image.
            }

            //let imageData = await file.arrayBuffer();
            
            let form = new FormData();
            form.append('attachment[]', file);
            let response = await fetch("/index.php?action=uploadattachment",
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: form
                });
            console.log(response);
            var text = await response.text();
            console.log(text);

        }
    }
    try {
        let text = await navigator.clipboard.readText();
        e.preventDefault();
        text = text.toUpperCase();
        console.log('Pasted UPPERCASE text: ', text);
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
});

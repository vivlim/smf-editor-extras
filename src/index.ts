import AWN from "awesome-notifications"
let globalOptions =  {}
let notifier = new AWN(globalOptions);

const image_types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

// https://stackoverflow.com/a/34278578
function typeInTextarea(newText: string, el: HTMLTextAreaElement) {
  const start = el.selectionStart
  const end = el.selectionEnd
  const text = el.value
  const before = text.substring(0, start)
  const after  = text.substring(end, text.length)
  el.value = (before + newText + after)
  el.selectionStart = el.selectionEnd = start + newText.length
  el.focus()
}

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
            let uploadPromise = async () => {
                let form = new FormData();
                form.append('attachment[]', file);
                let response = await fetch("/index.php?action=uploadattachment",
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        body: form
                    });
                console.log(response);
                let responseData = await response.json();
                if (!responseData.ok){
                    notifier.alert(`Failed to upload your image: ${responseData.error}.`);
                    return;
                }

                console.log(responseData);
                let textArea = document.getElementById("message") as HTMLTextAreaElement;
                typeInTextarea(responseData.insert_text, textArea);
                notifier.success("Successfully attached image.");
            }

            await notifier.asyncBlock(uploadPromise(), null, null, "Uploading image...", {'minDurations': {'async-block': 100}});
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

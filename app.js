document.addEventListener('DOMContentLoaded', () => {
    const generateComicBtn = document.getElementById('generateComicBtn');
    generateComicBtn.addEventListener('click', generateComic);

    async function generateComic() {
        console.log("clicked");
        const panelInputs = document.querySelectorAll('#comicForm input');
        const panelTexts = Array.from(panelInputs).map(input => input.value);

        if (panelTexts.some(text => text.trim() === '')) {
            alert('Please enter text for all 10 comic panels.');
            return;
        }

        try {
            for (const panelText of panelTexts) {
                if (panelText.trim() !== '') {
                    console.log("req sent");
                    const imageUrl = await makeApiCall(panelText);
                    displayComic(imageUrl);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Error generating comic. Please try again.');
        }
    }

    // Adjust makeApiCall to accept a single text instead of an array
    async function makeApiCall(panelText) {
        try {
            console.log("api called");
            const huggingFaceApiUrl = "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud";
            const huggingFaceApiKey = "VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM";

            const response = await fetch(huggingFaceApiUrl, {
                method: "POST",
                headers: {
                    "Accept": "image/png",
                    "Authorization": `Bearer ${huggingFaceApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: panelText }),
            });

            if (!response.ok) {
                throw new Error(`Error from the Hugging Face API: ${response.statusText}`);
            }

            const result = await response.blob();
            return URL.createObjectURL(result);
        } catch (error) {
            console.error(error);
            throw new Error('Error making Hugging Face API call');
        }
    }

    function displayComic(imageUrl) {
        console.log('Image URL:', imageUrl);

        const comicDisplay = document.getElementById('comicDisplay');

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Generated Comic';

        comicDisplay.appendChild(img);

        // Optionally revoke the Blob URL after a delay or when not needed
        setTimeout(() => {
            URL.revokeObjectURL(imageUrl);
        }, 5000); // Revoke after 5 seconds, adjust the delay based on your needs
    }
});

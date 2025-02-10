if (document.readyState == "interactive") {
    const styles = `
        .media-dropdown-container { position: relative; width: 100%; }
        .media-dropdown { position: absolute; top: 100%; left: 0; width: 100%; max-height: 400px; overflow-y: auto; background-color: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 1000; }
        .media-item { padding: 10px; border-bottom: 1px solid #eee; display: flex; align-items: center; cursor: pointer; }
        .media-item:hover { background-color: #f5f5f5; }
        .media-item img { width: 50px; height: 75px; object-fit: cover; margin-right: 10px; }
        .media-item-content { flex: 1; }
        .media-item-title { font-weight: bold; margin-bottom: 4px; }
        .media-item-type { font-size: 0.8em; color: #666; }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    let element = document.querySelector("#pills-movies > div.input-group.input-group-sm.mb-3");
    let element2 = document.querySelector("#pills-series > div.input-group.input-group-sm");

    let dropdownContainer = document.createElement("div");
    dropdownContainer.className = "media-dropdown-container";

    let dropdownClone = document.createElement("div");
    dropdownClone.className = "media-dropdown-container";

    let elementtopush1 = document.createElement("input");
    elementtopush1.placeholder = "Title";
    elementtopush1.setAttribute("type", "search");

    let elementtopush2 = document.createElement("input");
    elementtopush2.placeholder = "Series Title";
    elementtopush2.setAttribute("type", "search");

    const listener = async (e, inputElement, dropdownParent) => {
        if (e.code !== "Enter") return;
        let text_value = inputElement.value;
        let response;
        try {
		response = await fetch(`http://localhost:5000/getmedia?title=${text_value.split(" ").join("%20")}`);
        }
        catch (error) {
            console.log("Error: ", error);
            alert("Error: Could not connect to the server, Do you have the server running?");
        }
        let data = await response.json();
        let existingDropdown = dropdownParent.querySelector(".media-dropdown");
        if (existingDropdown) existingDropdown.remove();
        let dropdown = document.createElement("div");
        dropdown.className = "media-dropdown";
        data.forEach(item => {
            let resultItem = document.createElement("div");
            resultItem.className = "media-item";
            if (item.image) {
                let img = document.createElement("img");
                img.src = item.image;
                resultItem.appendChild(img);
            }
            let textContent = document.createElement("div");
            textContent.className = "media-item-content";
            let title = document.createElement("div");
            title.className = "media-item-title";
            title.textContent = item.title;
            let type = document.createElement("div");
            type.className = "media-item-type";
            type.textContent = item.type;
            textContent.appendChild(title);
            textContent.appendChild(type);
            resultItem.appendChild(textContent);
            resultItem.addEventListener("click", () => {
                dropdown.style.display = "none";
                let imdb_selector = document.querySelector("div.mb-3 > input:nth-child(1)");
                if (!imdb_selector) return;
                navigator.clipboard.writeText(item.id);
            });
            dropdown.appendChild(resultItem);
        });
        dropdownParent.appendChild(dropdown);
    };
    dropdownContainer.appendChild(elementtopush1);
    dropdownClone.appendChild(elementtopush2);
    element.appendChild(dropdownContainer);
    element2.appendChild(dropdownClone);
    elementtopush1.addEventListener("keypress", (e) => listener(e, elementtopush1, dropdownContainer));
    elementtopush2.addEventListener("keypress", (e) => listener(e, elementtopush2, dropdownClone));
}

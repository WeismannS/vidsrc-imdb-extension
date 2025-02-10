chrome.runtime.sendMessage({ action: "ready" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "ping") {
        sendResponse(true);
        return true;
    }
});

document.addEventListener('contextmenu', function(event) {
    chrome.runtime.sendMessage({
        action: "contextMenuClicked",
        x: event.pageX,
        y: event.pageY
    });
});

const styles = `
    .media-search-popup {
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        max-height: 400px;
        width: 300px;
        overflow-y: auto;
        z-index: 10000;
    }

    .media-search-input {
        width: 100%;
        padding: 8px;
        border: none;
        border-bottom: 1px solid #eee;
        margin-bottom: 8px;
        box-sizing: border-box;
    }

    .media-search-input:focus {
        outline: none;
        border-bottom-color: #0066cc;
    }

    .media-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .media-item:hover {
        background-color: #f5f5f5;
    }

    .media-item img {
        width: 50px;
        height: 75px;
        object-fit: cover;
        margin-right: 10px;
    }

    .media-item-content {
        flex: 1;
    }

    .media-item-title {
        font-weight: bold;
        margin-bottom: 4px;
    }

    .media-item-type {
        font-size: 0.8em;
        color: #666;
    }

    .media-results {
        max-height: 350px;
        overflow-y: auto;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

let popup = null;

async function performSearch(searchText, popup) {
    try {
        const response = await fetch(
            `http://localhost:5000/getmedia?title=${encodeURIComponent(searchText)}`
        );
        const data = await response.json();
        
        const resultsContainer = popup.querySelector('.media-results');
        resultsContainer.innerHTML = '';

        data.forEach(item => {
            const resultItem = document.createElement("div");
            resultItem.className = "media-item";

            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                resultItem.appendChild(img);
            }

            const textContent = document.createElement("div");
            textContent.className = "media-item-content";

            const title = document.createElement("div");
            title.className = "media-item-title";
            title.textContent = item.title;

            const type = document.createElement("div");
            type.className = "media-item-type";
            type.textContent = item.type;

            textContent.appendChild(title);
            textContent.appendChild(type);
            resultItem.appendChild(textContent);

            resultItem.addEventListener("click", () => {
                navigator.clipboard.writeText(item.id);
                document.body.removeChild(popup);
                popup = null;
            });

            resultsContainer.appendChild(resultItem);
        });

    } catch (error) {
        console.error("Error fetching media data:", error);
        alert("Error: Could not connect to the server. Is the server running?");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "searchMedia") {
        if (popup) {
            document.body.removeChild(popup);
        }

        popup = document.createElement("div");
        popup.className = "media-search-popup";
        popup.style.position = "absolute";
        const x = request.x;
        const y = request.y;

        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;

        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.className = "media-search-input";
        searchInput.placeholder = "Enter title to search...";

        const resultsContainer = document.createElement("div");
        resultsContainer.className = "media-results";

        popup.appendChild(searchInput);
        popup.appendChild(resultsContainer);
        document.body.appendChild(popup);

        searchInput.focus();

        searchInput.addEventListener("keypress", async (e) => {
            if (e.key === "Enter" && searchInput.value.trim()) {
                await performSearch(searchInput.value.trim(), popup);
            }
        });

        document.addEventListener("click", function closePopup(e) {
            if (popup && !popup.contains(e.target)) {
                document.removeEventListener("click", closePopup);
                if (document.body.contains(popup))
                    document.body.removeChild(popup);
                popup = null;
            }
        });
    }
});

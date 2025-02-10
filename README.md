# VidSrc IMDB Extension

This repository contains a browser extension and a Flask server that enables users to search for movies and series by title using the IMDB media API.

## Features
- Search for movies and TV series directly from the extension.
- Fetch data from IMDB's media suggestion API.
- Display search results in a dropdown list with title, type, and image.
- Copy IMDB ID to clipboard on selection.

## Repository Structure
```
vidsrc-imdb-extension/
│── extension/       # Contains the browser extension files
│── server.py        # Flask backend to fetch IMDB media data
│── README.md        # Documentation
```

## Installation

### Setting Up the Server
1. Install dependencies:
   ```bash
   pip install flask flask-cors requests
   ```
2. Run the server:
   ```bash
   python server.py
   ```
3. The server will start at `http://localhost:5000`

### Setting Up the Extension
1. Open your browser's extensions page:
   - **Chrome**: Go to `chrome://extensions/`
   - **Edge**: Go to `edge://extensions/`
2. Enable "Developer mode."
3. Click "Load unpacked" and select the `extension/` folder.
4. The extension should now be installed and ready to use.

## API Endpoint

### `GET /getmedia`
Fetches movie/series data based on a given title.

#### **Request Parameters:**
- `title` (string) - The title of the media to search for.

#### **Example Request:**
```bash
curl "http://localhost:5000/getmedia?title=Inception"
```

#### **Example Response:**
```json
[
    {
        "title": "Inception",
        "id": "tt1375666",
        "type": "movie",
        "image": "https://m.media-amazon.com/images/..."
    }
]
```

## Contributing
Feel free to fork this repository and submit pull requests with improvements!

## License
This project is open-source and licensed under the MIT License.


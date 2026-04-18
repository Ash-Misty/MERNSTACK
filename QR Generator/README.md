# Smart URL Tool

Smart URL Tool is a full-stack Node.js and Express application that generates short URLs, QR codes, or both from a single-page interface.

## Features

- Generate short redirect links with in-memory storage
- Generate downloadable QR code images
- Create both outputs together
- Redirect short URLs back to the original destination
- Responsive SPA served directly by Express

## Project structure

```text
.
|-- public
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- server
|   |-- index.js
|   `-- services
|       `-- urlService.js
|-- .gitignore
|-- package.json
`-- README.md
```

## Run locally

```bash
npm install
npm start
```

The app reads `process.env.PORT` and defaults to `3000`, which is suitable for Render deployment.

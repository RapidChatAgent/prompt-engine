# GitHub JSON Segment Query Tool

A **static HTML+JavaScript** tool for querying specific segments of large JSON files on GitHub Pages.  
No backend, no server, just drop `index.html` in your repository root and JSON files in `/data`!

**Live URL Example:**  
[https://rapidchatagent.github.io/prompt-engine](https://rapidchatagent.github.io/prompt-engine)

---

## ✨ Features

- **Static and Serverless:** No backend code, works entirely in the browser.
- **Easy file management:** Place your data as `.json` files in `/data`.
- **Flexible deep querying:**  
  - Dot notation: `profile.name`
  - Array index: `users[3].address`
  - Array filter: `users[id=42].address.city`
  - Chain and nest any way you like!
- **User-friendly error handling** for missing files and segments.

---

## 🚀 How to Use

### 1. **Preparing Your Repository**

- Place all your JSON files inside a `data/` folder in your repository root.
- Place `index.html` (from this repository) in your repository root.

**Example structure:**
```
prompt-engine/
  index.html
  data/
    users.json
    products.json
    bigfile.json
```

---

### 2. **Accessing Data in the Browser**

Visit:
```
https://rapidchatagent.github.io/prompt-engine?file=users
```
Add a `path` parameter to extract a specific value/segment (see below).

---

### 3. **Query Parameters**

- `file` – The filename (without `.json`) in the `/data` folder.
- `path` – (optional) Flexible deep-access path string.

---

### 4. **Examples**

| Purpose                  | Example URL                                                                                 | Result (if using sample data below) |
|--------------------------|--------------------------------------------------------------------------------------------|-------------------------------------|
| Get all users            | `?file=users`                                                                              | Array of users                      |
| Get Alice's city         | `?file=users&path=[id=1].address.city`                                                     | `"New York"`                        |
| Get Bob's order ID       | `?file=users&path=[id=2].orders[0].id`                                                     | `103`                               |
| Get first product's name | `?file=products&path=products[0].name`                                                     | _Depends on your data_              |
| Get entire big file      | `?file=bigfile`                                                                            | _Entire `bigfile.json`_             |
| Not found example        | `?file=users&path=[id=100].name`                                                           | "Segment not found..."              |

Usually accessed like:
```
https://rapidchatagent.github.io/prompt-engine?file=users&path=[id=2].orders[0].items[0].name
```

---

### 5. **Path Syntax**

- `a.b.c` — access property `c` inside `b` inside `a`
- `array[3]` — access 4th element in `array`
- `array[key=value]` — find first object in `array` with `object[key]==value`
- Combine: `people[id=5].contacts[0].email`
- Nest as deep as needed

---

### 6. **Sample JSON Data**

For `/data/users.json`:
```json
[
  {
    "id": 1,
    "name": "Alice",
    "address": { "city": "New York", "zip": "10001" },
    "orders": [
      { "id": 101, "items": [ { "name": "Widget", "price": 10 } ] }
    ]
  },
  {
    "id": 2,
    "name": "Bob",
    "address": { "city": "Boston", "zip": "02108" },
    "orders": [
      { "id": 103, "items": [ { "name": "Chair", "price": 50 } ] }
    ]
  }
]
```

---

## 📝 Notes

- **This is a read-only tool.**  
  It is fully front-end, reads static files only, and cannot modify data.
- **All files must be in `/data`**.  
  The path to each file is generated as `./data/{file}.json` relative to the site root.
- **Works on GitHub Pages and any static web host!**
- **CORS:** No issues, since all is same-origin (the same GitHub Pages site).

---

## 🧑‍💻 Customization

- _To change the data folder:_  
  Adjust the JS in `index.html`  
  (by default it uses `./data/`).
- _To improve user interface:_  
  Edit HTML/CSS in `index.html`.

---

## 🚧 Troubleshooting

- **404 or File Not Found:**  
  Make sure the file exists at `/data/{file}.json` and is committed to the `main` branch of your repo.
- **Segment not found:**  
  Check your `path` syntax and ensure it matches data structure.

---

## 📄 License

MIT

---

## 🙏 Credits

- [rapidchatagent](https://github.com/rapidchatagent) — repo owner & design

---

### 🎯 Enjoy querying your JSON data with no server and no fuss!


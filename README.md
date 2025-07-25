
# JSON Param Query Tool

A **static HTML+JavaScript tool** for querying deep inside big JSON files using *URL query parameters* — no backend or APIs needed.
Just deploy on GitHub Pages and access segments from your JSON data using simple parameters.

**Live Demo:**  
➡️ [https://rapidchatagent.github.io/prompt-engine](https://rapidchatagent.github.io/prompt-engine)

---

## ✨ Features

- **Zero backend** — no server, just static HTML and JSON.
- **Query by URL parameters:** Each `?key=value` step is a navigation/filter step.
- **No complex syntax:** No bracket notation, paths, or script objects needed.
- **Supports:**
  - Array filtering (e.g. `id=4` finds object with `id==4`)
  - Array indexing (e.g. `orders=0` gets first order)
  - Property navigation (e.g. `profile`, `address`)
  - Any mix and sequence of these
- **Covers all combinations of nested object/array structures**
- **User-friendly:** If result is found, only the prettified JSON segment is returned in the HTML.

---

## 🚀 How to Use

### 1. **Prepare Your Repo**

- Place `index.html` from this repository in your repo root.
- Place all your JSON data files in a `data/` folder at the root.

**Example:**
```
prompt-engine/
  index.html
  data/
    users.json
    orders.json
    inventory.json
```

---

### 2. **Deploy with GitHub Pages**

- Make sure your repo’s Pages is set to deploy from the root.
- Wait for [https://rapidchatagent.github.io/prompt-engine](https://rapidchatagent.github.io/prompt-engine) to be live.

---

### 3. **Request Data Using Query Parameters**

- `file=FILENAME` — The filename (without `.json`) in your `data/` folder.
- Each following parameter is a navigation/filter step, **evaluated in order**:
    - If you use `property=value` and current context is an array, it becomes a filter for objects where `property==value`.
    - If you use `property` as a bare key (no value), it navigates into that property of the current object.
    - If you use `property=N` and current value is an array, it picks index `N`.

---

## 🧑‍💻 Examples

Assume `/data/users.json`
```json
[
  {
    "id": 1,
    "name": "Alice",
    "address": { "city": "New York" },
    "orders": [
      { "id": 2001, "items": [ { "name": "Laptop", "price": 1000 } ] }
    ]
  },
  {
    "id": 4,
    "name": "Dan",
    "address": { "location": { "lat": 30.2672, "lng": -97.7431 } }
  }
]
```

---

**Get Dan by id, then location, then latitude:**

```
https://rapidchatagent.github.io/prompt-engine?file=users&id=4&address=location&lat
```
**Returns**
```json
30.2672
```

---

**Get first user's second order's first item name:**
```
https://rapidchatagent.github.io/prompt-engine?file=users&0&orders=0&items=0&name
```
**Returns**
```json
"Laptop"
```

---

**Filter by username:**
```
https://rapidchatagent.github.io/prompt-engine?file=users&name=Alice&address=city
```
**Returns**
```json
"New York"
```

---

**Get all users:**
```
https://rapidchatagent.github.io/prompt-engine?file=users
```

---

**Get Dan's lng directly:**
```
https://rapidchatagent.github.io/prompt-engine?file=users&id=4&address=location&lng
```
**Returns**
```json
-97.7431
```

---

**If file or result not found, you'll get a simple error response.**

---

## 🛠 Path Resolution Rules (in order)

For each param after `file`...

1. If current value is array:
    - If param is `key=value`, finds object with `obj[key] == value`
    - If param is numeric, uses as index (`orders=1` → second order)
2. If current value is object:
    - If param is `key`, gets property `key`
    - If param is `key=value` and property is an array, filters that array
3. (repeat)

---

## 📂 Sample `/data/users.json`

(see above or adapt your own; any structure is supported)

---

## ⚠️ Notes

- **file** param is always required!
- Currently, only one filter/index step is supported per level (though you can chain many steps).
- All query params (other than `file`) are processed in order of appearance in the URL.
- Works for any public repo/host/static site as long as structure is the same.

---

## 📄 License

MIT

---

## 🙏 Credits

- [rapidchatagent](https://github.com/rapidchatagent) — project owner

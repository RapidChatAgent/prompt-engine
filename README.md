# prompt-engine



## 📖 Example API Calls

This tool behaves like a simple GET API endpoint:  
**Base URL:**  
```
https://rapidchatagent.github.io/prompt-engine/data
```

### **Parameters**

- `file` – the base filename (excluding `.json`)
- `path` – the segment to extract, using dot/array notation (optional)

---

### 🔹 **Get an entire file**
**Request:**  
```
GET https://rapidchatagent.github.io/prompt-engine/data?file=users
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Alice",
    "address": {
      "city": "New York"
    }
  },
  {
    "id": 2,
    "name": "Bob",
    "address": {
      "city": "Boston"
    }
  }
]
```

---

### 🔹 **Get a nested value by path**
**Request:**  
```
GET https://rapidchatagent.github.io/prompt-engine/data?file=users&path=0.address.city
```
**Response:**
```json
"New York"
```

---

### 🔹 **Find an object in an array**
**Request:**  
```
GET https://rapidchatagent.github.io/prompt-engine/data?file=users&path=users[id=2].address.city
```
Or if the array is at the root:
```
GET https://rapidchatagent.github.io/prompt-engine/data?file=users&path=[id=2].address.city
```
**Response:**
```json
"Boston"
```

---

### 🔹 **Chain filters and indices**
**Request:**  
(Suppose your JSON has nested arrays, e.g. orders per user)
```
GET https://rapidchatagent.github.io/prompt-engine/data?file=users&path=users[id=1].orders[3].items[name=Laptop].price
```

---

### 🔹 **Handle missing file**
**Request:**  
```
GET https://rapidchatagent.github.io/prompt-engine/data?file=notfound
```
**Response:**
```json
{
  "error": "File not found"
}
```
*(For display, the web page will show a user-friendly error instead of JSON.)*

---

### 🔹 **Handle missing segment**
**Request:**  
```
GET https://rapidchatagent.github.io/prompt-engine/data?file=users&path=users[id=99].address.city
```
**Response:**
```json
{
  "error": "Segment not found"
}
```
*(For display, the web page will show a user-friendly error instead of JSON.)*

---

## ℹ️ **Notes**

- This API is read-only and intended for use in a browser, but you can fetch the URLs from any client (script, tool, or browser tab).
- If you need JSON content-type in the response (for script use), you could modify the HTML, but by default, this tool displays JSON in the web page.

---

## **Quick Reference Table**

| Purpose                    | Example API URL                                                                                                             | Typical Result             |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------|----------------------------|
| Get entire `users.json`    | https://rapidchatagent.github.io/prompt-engine/data?file=users                                                             | `[ ... ]`                  |
| Get 2nd user's name        | https://rapidchatagent.github.io/prompt-engine/data?file=users&path=1.name                                                 | `"Bob"`                    |
| Find by id in array        | https://rapidchatagent.github.io/prompt-engine/data?file=users&path=[id=2].address.city                                    | `"Boston"`                 |
| File not found             | https://rapidchatagent.github.io/prompt-engine/data?file=notfound                                                          | Error message              |
| Segment not found          | https://rapidchatagent.github.io/prompt-engine/data?file=users&path=doesnot.exist                                          | Error message              |

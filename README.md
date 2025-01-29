# rbx-reader
A module that allows for reading of `.rbxm` and `.rbxl` files.

**Huge thanks to @shiinazzz for helping to get the code into useful TypeScript form.**

## Usage
Basic reading:
```js
const fs = require("node:fs")
const reader = require("rbx-reader")
const buf = fs.readFileSync("./path/to/roblox/file.rbxm") // Can also be an .rbxl
const result = reader.parseBuffer(buf)
```

## JSON Patch types 🧩

This library provides TypeScript type definitions for **JSON Patch operations** as defined in [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902).

---

### What is JSON Patch?

JSON Patch is a standard format that defines a set of operations to apply changes to a JSON document. It's useful for sending only the necessary modifications to a server, rather than the entire document.

---

### The Types

The core of this library is the definition of the base JSON Patch operation interface and its specific types.

- The base type is `Operation` which all specific operations implement.
- A JSON Patch document is an array of operations.

The operations are defined as follows:

| Operation Type | Description                                                             | Required fields       | Example                                                  |
| :------------- | :---------------------------------------------------------------------- | :-------------------- | :------------------------------------------------------- |
| **`add`**      | Adds a value to an object or inserts an element into an array.          | `op`, `path`, `value` | `{"op": "add", "path": "/a/1", "value": {"foo": "bar"}}` |
| **`remove`**   | Removes an object member or array element.                              | `op`, `path`          | `{"op": "remove", "path": "/a/1"}`                       |
| **`replace`**  | Replaces the value of an object member or array element.                | `op`, `path`, `value` | `{"op": "replace", "path": "/a/0/foo", "value": "baz"}`  |
| **`move`**     | Moves a value from one location to another within the document.         | `op`, `from`, `path`  | `{"op": "move", "from": "/a/1", "path": "/b/0"}`         |
| **`copy`**     | Copies a value from one location to another within the document.        | `op`, `from`, `path`  | `{"op": "copy", "from": "/a/0", "path": "/b/0"}`         |
| **`test`**     | Tests that the value at a specified location is equal to a given value. | `op`, `path`, `value` | `{"op": "test", "path": "/a/0/name", "value": "bar"}`    |

---

### Usage

Import the specific operation type(s) or the `Patch` union type:

```typescript
import type {
  Patch,
  AddOperation,
  RemoveOperation,
  ReplaceOperation,
  MoveOperation,
  CopyOperation,
  TestOperation,
} from "@json-patch/types";

// Example 1: Defining a full Patch document
const patchDocument: Array<Patch> = [
  { op: "replace", path: "/name", value: "Example 1" },
  { op: "add", path: "/tags/-", value: "beta" }, // '-' appends to an array
];

// Example 2: Using a specific operation type
const addOp: AddOperation = {
  op: "add",
  path: "/settings/theme",
  value: "dark",
};
```

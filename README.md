# What is JSON Patch? 🧩

JavaScript Object Notation (JSON) Patch ([RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902)):

> _"JSON Patch defines a JSON document structure for expressing a
> sequence of operations to apply to a JavaScript Object Notation
> (JSON) document; it is suitable for use with the HTTP PATCH method.
> The "application/json-patch+json" media type is used to identify such
> patch documents."_

---

## Usage

Import the `PatchDocument` type, the `Patch` union type or any of the specific operation type(s):

```typescript
import type {
  Patch,
  PatchDocument,
  AddOperation,
  RemoveOperation,
  ReplaceOperation,
  MoveOperation,
  CopyOperation,
  TestOperation,
} from "@json-patch/types";

// Example 1: Defining a full JSON Patch document
const patchDocument: PatchDocument = [
  { op: "replace", path: "/name", value: "Example 1" },
  { op: "add", path: "/tags/-", value: "beta" }, // '-' appends to an array
];

// Example 2: Using a specific operation type ("add")
const addOp: AddOperation = {
  op: "add",
  path: "/settings/theme",
  value: "dark",
};
```

---

## Types

The core of this library is the definition of the base JSON Patch operation interface and its specific types.

### `Operation`

```typescript
interface Operation<
  T extends "add" | "remove" | "replace" | "move" | "copy" | "test",
> {
  op: T;
  path: `/${string}`;
}
```

Defines the common structure for all JSON Patch operations.

- `op` specifies the type of operation.
- `path` indicates the target location ([JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901#section-3)).

### `AddOperation`

```typescript
interface AddOperation extends Operation<"add"> {
  value: unknown;
}
```

Adds a new property to an object or a new element to an array.

### `ReplaceOperation`

```typescript
interface ReplaceOperation extends Operation<"replace"> {
  value: unknown;
}
```

Replaces the value at the target location with a new value.

### `RemoveOperation`

```typescript
interface RemoveOperation extends Operation<"remove"> {}
```

Removes the value at the target location.

### `MoveOperation`

```typescript
export interface MoveOperation extends Operation<"move"> {
  from: `/${string}`;
}
```

Removes the value at a specified location and adds it to the target location.

### `CopyOperation`

```typescript
interface CopyOperation extends Operation<"copy"> {
  from: `/${string}`;
}
```

Copies the value at a specified location to the target location.

### `TestOperation`

```typescript
interface TestOperation extends Operation<"test"> {
  value: unknown;
}
```

Tests that a value at the target location is equal to a specified value.

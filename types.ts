// RFC 6901 -> https://datatracker.ietf.org/doc/html/rfc6901
// RFC 6902 -> https://datatracker.ietf.org/doc/html/rfc6902

/**
 * Defines the common structure for all JSON Patch operations (RFC 6902).
 * The 'op' field specifies the type of operation, and 'path' indicates the target location.
 */
type Operation<
  T extends "add" | "remove" | "replace" | "move" | "copy" | "test",
> = { op: T; path: `/${string}` };

/**
 * ?
 */
export type Patch =
  | AddOperation
  | RemoveOperation
  | ReplaceOperation
  | MoveOperation
  | CopyOperation
  | TestOperation;

/**
 * The `add` operation performs one of the following functions,
 * depending upon what the target location references:
 *
 * - If the target location specifies an array index, a new value is inserted into the array at the specified index.
 * - If the target location specifies an object member that does not already exist, a new member is added to the object.
 * - If the target location specifies an object member that does exist, that member's value is replaced.
 *
 * The operation object MUST contain a "value" member whose content specifies the value to be added.
 *
 * For example:
 *
 * `{ "op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ] }`
 *
 * When the operation is applied, the target location MUST reference one of:
 *
 * - The root of the target document - whereupon the specified value becomes the entire content of the target document.
 * - A member to add to an existing object - whereupon the supplied value is added to that object at the indicated location.
 *   If the member already exists, it is replaced by the specified value.
 * - An element to add to an existing array - whereupon the supplied value is added to the array at the indicated location.
 *   Any elements at or above the specified index are shifted one position to the right.  The specified index MUST NOT be greater
 *   than the number of elements in the array.  If the "-" character is used to index the end of the array (see RFC 6901),
 *   this has the effect of appending the value to the array.
 *
 * Because this operation is designed to add to existing objects and arrays, its target location will often not exist.
 * Although the pointer's error handling algorithm will thus be invoked, this specification defines the error handling behavior
 * for "add" pointers to ignore that error and add the value as specified.
 *
 * However, the object itself or an array containing it does need to exist, and it remains an error for that not to be the case.
 * For example, an "add" with a target location of "/a/b" in the document
 * `{ "a": { "foo": 1 } }` is not an error, because "a" exists, and "b" will be added to its value.
 *
 * It is an error in the document `{ "q": { "bar": 2 } }` because "a" does not exist.
 */
export type AddOperation = Operation<"add"> & { value: unknown };

/**
 * ?
 */
export type RemoveOperation = Operation<"remove">;

/**
 * ?
 */
export type ReplaceOperation = Operation<"replace"> & { value: unknown };

/**
 * ?
 */
export type MoveOperation = Operation<"move"> & { from: `/${string}` };

/**
 * ?
 */
export type CopyOperation = Operation<"copy"> & { from: `/${string}` };

/**
 * ?
 */
export type TestOperation = Operation<"test"> & { value: unknown };

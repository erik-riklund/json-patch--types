//
// JavaScript Object Notation (JSON) Patch
// Copyright (c) 2013 IETF Trust and the persons identified as the
// document authors.  All rights reserved.
//
// https://datatracker.ietf.org/doc/html/rfc6902
//

/**
 * Represents a single JSON Patch operation.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6902#section-4
 */
export type Patch =
  | AddOperation
  | RemoveOperation
  | ReplaceOperation
  | MoveOperation
  | CopyOperation
  | TestOperation;

/**
 * Defines the common structure for all JSON Patch operations.
 *
 * The `op` field specifies the type of operation, and `path` indicates the target location
 * ({@link https://datatracker.ietf.org/doc/html/rfc6901#section-3|JSON Pointer}).
 */
interface Operation<
  T extends "add" | "remove" | "replace" | "move" | "copy" | "test",
> {
  op: T;
  path: `/${string}`;
}

/**
 * The "add" operation adds a new property to an object or a new element to an array.
 *
 * It performs one of the following functions, depending upon what the target location references:
 *
 * - If the target location specifies an array index,
 *   a new value is inserted into the array at the specified index.
 *
 * - If the target location specifies an object member that does
 *   not already exist, a new member is added to the object.
 *
 * - If the target location specifies an object member that does exist,
 *   that member's value is replaced.
 *
 * The operation object MUST contain a "value" member whose content
 * specifies the value to be added.
 *
 * `{ "op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ] }`
 *
 * When the operation is applied, the target location MUST reference one of:
 *
 * - The root of the target document - whereupon the specified value
 *   becomes the entire content of the target document.
 *
 * - A member to add to an existing object - whereupon the supplied
 *   value is added to that object at the indicated location.
 *
 *   _If the member already exists, it is replaced by the specified value._
 *
 * - An element to add to an existing array - whereupon the supplied
 *   value is added to the array at the indicated location. Any elements
 *   at or above the specified index are shifted one position to the right.
 *
 *   The specified index MUST NOT be greater than the number of elements in the array.
 *
 *   If the "-" character is used to index the end of the array (see RFC 6901),
 *   this has the effect of appending the value to the array.
 *
 * Because this operation is designed to add to existing objects and arrays, its target
 * location will often not exist. Although the pointer's error handling algorithm will
 * thus be invoked, this specification defines the error handling behavior for "add" pointers
 * to ignore that error and add the value as specified.
 *
 * However, the object itself or an array containing it does need to exist,
 * and it remains an error for that not to be the case. For example, an "add"
 * with a target location of "/a/b" in the document `{ "a": { "foo": 1 } }`
 * is not an error, because "a" exists, and "b" will be added to its value.
 *
 * It is an error in the document `{ "q": { "bar": 2 } }` because "a" does not exist.
 */
export interface AddOperation extends Operation<"add"> {
  value: unknown;
}

/**
 * The "remove" operation removes the value at the target location.
 *
 * `{ "op": "remove", "path": "/a/b/c" }`
 *
 * The target location MUST exist for the operation to be successful.
 *
 * If removing an element from an array, any elements above the specified
 * index are shifted one position to the left.
 */
export interface RemoveOperation extends Operation<"remove"> {}

/**
 * The "replace" operation replaces the value at the target location with a new value.
 *
 * The operation object MUST contain a "value" member whose content specifies the replacement value.
 *
 * `{ "op": "replace", "path": "/a/b/c", "value": "foo" }`
 *
 * The target location MUST exist for the operation to be successful.
 *
 * This operation is functionally identical to a "remove" operation for a value,
 * followed immediately by an "add" operation at the same location with the replacement value.
 */
export interface ReplaceOperation extends Operation<"replace"> {
  value: unknown;
}

/**
 * The "move" operation removes the value at a specified location and
 * adds it to the target location.
 *
 * `{ "op": "move", "from": "/a/b/c", "path": "/a/b/d" }`
 *
 * The operation object MUST contain a "from" member, which is a string
 * containing a JSON Pointer value that references the location in the
 * target document to move the value from.
 *
 * The "from" location MUST exist for the operation to be successful.
 *
 * This operation is functionally identical to a "remove" operation on
 * the "from" location, followed immediately by an "add" operation at
 * the target location with the value that was just removed.
 *
 * The "from" location MUST NOT be a proper prefix of the "path" location;
 * i.e., a location cannot be moved into one of its children.
 */
export interface MoveOperation extends Operation<"move"> {
  from: `/${string}`;
}

/**
 * The "copy" operation copies the value at a specified location to the target location.
 *
 * `{ "op": "copy", "from": "/a/b/c", "path": "/a/b/e" }`
 *
 * The operation object MUST contain a "from" member, which is a string
 * containing a JSON Pointer value that references the location in the
 * target document to copy the value from.
 *
 * The "from" location MUST exist for the operation to be successful.
 *
 * This operation is functionally identical to an "add" operation at the
 * target location using the value specified in the "from" member.
 */
export interface CopyOperation extends Operation<"copy"> {
  from: `/${string}`;
}

/**
 * The "test" operation tests that a value at the target location is
 * equal to a specified value.
 *
 * `{ "op": "test", "path": "/a/b/c", "value": "foo" }`
 *
 * The operation object MUST contain a "value" member that conveys the
 * value to be compared to the target location's value.
 *
 * The target location MUST be equal to the "value" value for the
 * operation to be considered successful.
 *
 * Here, "equal" means that the value at the target location and the
 * value conveyed by "value" are of the same JSON type, and that they
 * are considered equal by the following rules for that type:
 *
 * - strings are considered equal if they contain the same number of
 *   Unicode characters and their code points are byte-by-byte equal.
 *
 * - numbers are considered equal if their values are numerically equal.
 *
 * - arrays are considered equal if they contain the same number of values,
 *   and if each value can be considered equal to the value at the corresponding
 *   position in the other array, using this list of type-specific rules.
 *
 * - objects are considered equal if they contain the same number of members,
 *   and if each member can be considered equal to a member in the other object,
 *   by comparing their keys (as strings) and their values (using this list of type-specific rules).
 *
 * - literals (false, true, and null): are considered equal if they are the same.
 *
 * Note that the comparison that is done is a logical comparison;
 * e.g., whitespace between the member values of an array is not significant.
 *
 * Also, note that ordering of the serialization of object members is not significant.
 */
export interface TestOperation extends Operation<"test"> {
  value: unknown;
}

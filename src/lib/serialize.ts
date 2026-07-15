/**
 * Mongoose Document Serialization Utilities
 * 
 * Converts Mongoose documents, lean results, and any MongoDB objects
 * into plain JavaScript values safe for Next.js Server→Client Component transfer.
 * 
 * Handles: ObjectId, Date, nested documents, arrays, Maps, subdocuments.
 * Output contains only: string, number, boolean, null, plain arrays, plain objects.
 */

/**
 * Recursively serialize any value into a plain JavaScript object.
 * 
 * - If the value is a Mongoose Document (has `.toObject()`), converts it first.
 * - Then strips all prototypes, class instances, ObjectIds, and Dates via
 *   JSON round-trip.
 * 
 * @param value - Any value: Mongoose document, lean object, array, primitive, etc.
 * @returns A plain JavaScript value safe for Client Components.
 */
export function serialize<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  // If it's a Mongoose Document instance, convert to plain object first
  if (typeof value === "object" && "toObject" in (value as any)) {
    value = (value as any).toObject();
  }

  // JSON round-trip strips all prototypes, converts ObjectId→string, Date→ISO string
  return JSON.parse(JSON.stringify(value));
}

/**
 * Serialize a single product document for Client Component consumption.
 */
export function serializeProduct(product: any): any {
  return serialize(product);
}

/**
 * Serialize an array of product documents for Client Component consumption.
 */
export function serializeProducts(products: any[]): any[] {
  return serialize(products);
}

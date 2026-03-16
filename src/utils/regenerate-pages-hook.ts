import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";

export const regeneratePage: CollectionAfterChangeHook = async ({
  collection,
  doc,
}) => {
  revalidatePath(`/${collection.slug}`);

  return doc;
};

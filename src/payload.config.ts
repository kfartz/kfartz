// storage-adapter-import-placeholder

import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { searchPlugin } from "@payloadcms/plugin-search";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { ChamberTypes } from "./collections/ChamberTypes";
import { Crystals } from "./collections/Crystals";
import { Measurements } from "./collections/Measurements";
import { Processings } from "./collections/Processings";
import { Publications } from "./collections/Publications";
import { Refinements } from "./collections/Refinements";
import { Users } from "./collections/Users";
import { flattenObject } from "./utiils";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Crystals,
    Measurements,
    Processings,
    Refinements,
    Publications,
    ChamberTypes,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    searchPlugin({
      collections: [
        Crystals.slug,
        Measurements.slug,
        Processings.slug,
        Refinements.slug,
        Publications.slug,
      ],
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        title: flattenObject(originalDoc),
      }),
    }),
  ],
});

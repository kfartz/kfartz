import { CollectionConfig } from "payload";
import { ChamberTypes } from "./collections/ChamberTypes";
import { Crystals } from "./collections/Crystals";
import { Measurements } from "./collections/Measurements";
import { Processings } from "./collections/Processings";
import { Publications } from "./collections/Publications";
import { Refinements } from "./collections/Refinements";
import { Users } from "./collections/Users";

export type Schema = (CollectionConfig&{slug: string, name: string, description: string })[]

const schema:Schema = [
    {...ChamberTypes, name: "Chamber Types", description: "Chamber Type"},
    {...Crystals, name: "Crystals", description: "the physical crystal"},
    {...Measurements, name: "Measurements", description: "the measurement"},
    {...Processings, name: "Processings", description: "TODO"},
    {...Publications, name:"Publications", description: "TODO"},
    {...Refinements, name:"Refinements", description: "TODO"},
    {...Users, name:"Users", description:"TODO"},
] 
export default schema

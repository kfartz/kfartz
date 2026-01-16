import { AddContentForm } from "@/components/add-content-form";
import { availableTables } from "@/tables";

export default async function ({
    params,
}:{
    params: Promise<{table: string}>
}){
    const {table} = await params
    const tableMetadata = availableTables.find((e)=>e.id===table)
    if (!tableMetadata) return <>
        {"Oops invalid table"}
    </>

    return <AddContentForm currentTable={tableMetadata}></AddContentForm>
}

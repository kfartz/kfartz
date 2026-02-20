import { redirect } from "next/navigation";
import { tableSlugs } from "@/utils/table";
export default async function TablePage() {
  // const [searchQuery, setSearchQuery] = useState("");
  redirect(`/${tableSlugs[0]}`);
}

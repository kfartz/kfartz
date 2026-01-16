"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const renderInput = (field: {
    readOnly?: boolean | undefined;
    name: string;
	type?: "textarea"|"number"
}|{
	readonly?: boolean | undefined;
	name: string;
	type: "select",
	options: string[],
}, value: string, handleChange: (a: {target: {name:string, value: string}})=>void) => {
	const props = {
		id: field.name,
		name: field.name,
		value: value || "",
		onChange: handleChange,
		className: "col-span-3",
	};

	switch (field.type) {
		case "textarea":
			return <Textarea {...props} />;
		case "select":
			return (
				<Select onValueChange={(val) => handleChange({ target: { name: field.name, value: val } })}>
					<SelectTrigger className="col-span-3">
						<SelectValue placeholder={`Select a ${field.name}`} />
					</SelectTrigger>
					<SelectContent>
						{field.options?.map((option: string) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		case "number":
			return <Input type="number" {...props} />;
		default:
			return <Input type="text" {...props} />;
	}
};


export function AddContentForm({
	currentTable,
}: {
	currentTable: {name: string, schema: {readOnly?:boolean, name: string}[]};
}) {
	const [formData, setFormData] = useState<{[key:string]: string}>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string, value: string } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (name === "name" || name === "full_name") { // Assuming 'name' or 'full_name' is the primary identifier
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitting new record:", formData);
		// Here you would typically call an API to save the data
	};

	return (
		<form onSubmit={handleSubmit} className="p-10">
			<div className="grid gap-4 py-4">
				{currentTable.schema
					.filter((field) => !field.readOnly)
					.map((field) => (
						<div key={field.name} className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor={field.name} className="text-right">
								{field.name.replace(/_/g, " ")}
							</Label>
							{renderInput(field, formData[field.name], handleChange)}
						</div>
					))}
			</div>
			<div className="flex justify-end gap-2">
				<Button variant="outline" type="button">
					Cancel
				</Button>
				<Button type="submit">Save changes</Button>
			</div>
		</form>
	);
}
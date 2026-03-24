# Adding Records

You can add new records to any collection through the insert page. Kfartz also supports importing data from CIF files to speed up data entry for refinements.

## Accessing the Insert Page

1. Navigate to the table where you want to add a record
2. Press `Ctrl+I` (or `Cmd+I` on Mac)
3. Or click the Insert button in the interface

![](../assets/insert.avif)

## Using the Insert Form

The form displays fields appropriate for the selected collection. Required fields are marked and must be completed before saving.

### Field Types

**Text fields** - Type the value directly

**Number fields** - Enter numeric values; validation ensures correct format

**Select fields** - Choose from predefined options (e.g., crystal shape, experiment type)

**Relationship fields** - Select from existing records in related collections. These fields include search functionality to find the record you need.

**Conditional fields** - Some fields only appear based on other selections. For example, measurement forms show pressure, chamber type, and pressure medium fields only when the experiment type is set to "non-ambient".

### Saving

After completing the form, click Save to create the record. You'll be notified of success or any validation errors.

---

## Importing from CIF Files

For refinement data, Kfartz can automatically extract values from CIF (Crystallographic Information File) files. This significantly reduces manual data entry.

### How to Import

1. Navigate to the Refinements insert page
2. Locate the CIF import button
3. Click to select a `.cif` file, or drag and drop the file
4. The form fields will be populated with extracted values

### What Gets Imported

The CIF import extracts:

- Cell parameters (a, b, c, alpha, beta, gamma)
- Cell volume
- Space group
- Chemical formula
- R-factors (R1, wR2)
- Other standard CIF data items

### After Import

Review the populated fields before saving:

- Verify extracted values are correct
- Fill in any fields not present in the CIF (e.g., author, processing references)
- Make corrections if needed

The import is a starting point; you remain in control of the final values.

---

## Next Steps

- Understand [how records relate](understanding-relationships.md) to each other
- Learn to [search](searching.md) your data

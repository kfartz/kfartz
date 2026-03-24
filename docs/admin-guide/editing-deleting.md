# Editing and Deleting Records

Regular users can create records but cannot modify or delete them. Only administrators can edit and delete existing records.

## Accessing Records for Editing

1. Navigate to the admin panel at `/admin`
2. Select the collection containing the record (Crystals, Measurements, etc.)
3. Find and click the record you want to modify

![](../assets/admin-editing.avif)

## Editing a Record

1. Open the record in the admin panel
2. Modify fields as needed
3. Click **Save**

All fields can be edited, including:

- Basic data fields
- Relationship references (e.g., changing which crystal a measurement references)
- Conditional fields

## Deleting a Record

1. Open the record in the admin panel
2. Click the icon with three dots
3. Click **Delete**
4. Confirm the deletion

**Warning**: Deletion is permanent and cannot be undone.

## Data Integrity Considerations

Before deleting, consider the impact on related records:

### Crystals

Deleting a crystal may orphan any measurements that reference it. Check if measurements exist before deleting.

### Measurements

Deleting a measurement may orphan any processings that reference it.

### Processings

Deleting a processing may affect refinements that reference it. Refinements can reference multiple processings, so the impact depends on the specific refinement.

### Refinements

Deleting a refinement may:

- Affect publications that reference it
- Break refinement chains if other refinements reference this one as a previous refinement

### Publications

Publications are typically safe to delete as they are at the end of the data chain.

## Best Practices

- **Think before deleting** - Consider downstream effects
- **Edit rather than delete** - If data is incorrect, editing is often safer than deleting and recreating
- **Document changes** - For significant edits, consider noting the change in relevant fields or external documentation
- **Verify relationships** - After editing relationship fields, verify the data still makes sense

## Bulk Operations

The admin panel may support bulk selection and operations. Use with caution:

- Select multiple records using checkboxes
- Apply bulk actions as available
- Always confirm before executing bulk deletions

## Next Steps

- Return to [user management](user-management.md)
- Review the main [documentation index](../README.md)

# Managing Chamber Types

Chamber types define the pressure chamber configurations available for non-ambient crystallography experiments. Only administrators can create and manage chamber types.

## What Are Chamber Types?

When recording a non-ambient measurement (high-pressure experiment), users must specify the pressure chamber used. Chamber types are predefined options that include:

- Chamber name/model

These standardized options ensure consistency across measurements.

## Accessing Chamber Types

1. Navigate to the admin panel at `/admin`
2. Find **Chamber Types** in the sidebar
3. Click to view existing chamber types

![](../assets/chamber-types.avif)

## Creating a New Chamber Type

1. Navigate to Chamber Types in the admin panel
2. Click **Create New**
3. Enter the chamber details:
   - **Name** - Descriptive name for the chamber (e.g., "Merrill-Bassett DAC")
4. Click **Save**

The new chamber type immediately becomes available for selection in measurement forms.

## Editing a Chamber Type

1. Navigate to Chamber Types
2. Click the chamber type to edit
3. Modify the fields as needed
4. Click **Save**

## Deleting a Chamber Type

1. Navigate to Chamber Types
2. Click the chamber type to delete
3. Click the icon with three dots
4. Click **Delete**
5. Confirm the deletion

**Warning**: Avoid deleting chamber types that are referenced by existing measurements. This may cause data integrity issues.

## Next Steps

- Learn about [editing and deleting records](editing-deleting.md)
- Return to [user management](user-management.md)

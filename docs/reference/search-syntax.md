# Search Syntax Reference

Complete reference for Kfartz search query syntax.

## Basic Format

Queries follow the pattern:

```
field<operator>value
```

Multiple conditions can be combined, separated by spaces. All conditions must match (AND logic).

## Operators

| Operator     | Name             | Description          | Example            |
| ------------ | ---------------- | -------------------- | ------------------ |
| `=`          | Equals           | Exact match          | `source=synthetic` |
| `-=`         | Not equals       | Excludes exact match | `-source=natural`  |
| `:`          | Contains         | Substring match      | `name:quartz`      |
| `>`          | Greater than     | Numeric comparison   | `dimensions.max>0.5`       |
| `>=` or `=>` | Greater or equal | Numeric comparison   | `pressure>=1.0`    |
| `<`          | Less than        | Numeric comparison   | `dimensions.min<0.1`       |
| `<=` or `=<` | Less or equal    | Numeric comparison   | `_refine_ls_R_factor_gt<=0.05`         |

## Values

### Simple Values

Values without spaces can be written directly:

```
source=synthetic
shape=block
```

### Values with Spaces

Wrap values containing spaces in double quotes:

```
pi_name:"John Smith"
facility_name:"Diamond Light Source"
```

### Numeric Values

Numeric comparisons work with decimal values:

```
dimensions.max>0.5
pressure>=2.5
_cell_volume.value<1000
```

## Nested Fields

Use dot notation to query fields within related records:

```
crystal.source=synthetic
crystal.name:ruby
measurement.experiment_type=non-ambient
processing.author:"Jane Doe"
```

This searches the related record's fields through the relationship.

## Combining Conditions

Separate multiple conditions with spaces. All conditions must be true:

```
source=synthetic shape=block dimensions.max>0.3
```

This finds synthetic crystals with block shape AND maxDim greater than 0.3.

## Examples by Collection

### Crystals

```
# Synthetic crystals
source=synthetic

# Block-shaped crystals larger than 0.5mm
shape=block dimensions.max>0.5

# Blue crystals
color.c:blue

# Plates from natural sources
source=natural shape=plate
```

### Measurements

```
# Non-ambient experiments
experiment_type=non-ambient

# Specific PI
pi_name:"John Smith"

# High-pressure experiments above 5 GPa
experiment_type=non-ambient pressure>5

# Measurements at a specific facility
facility_name:"APS"
```

### Processings

```
# By specific author
author:"Jane Doe"

# Linked to a specific crystal via measurement
measurement.crystal.name:diamond
```

### Refinements

```
# HAR refinements
aspherical_atom_model=HAR

# Low R-factor structures
_refine_ls_R_factor_gt<0.03

# Specific space group
_space_group_name_H-M_alt:P21/c

# Refinements with disorder
disorder=true
```

### Publications

```
# By DOI substring
doi:10.1107
```

## Troubleshooting

### No results returned

- Check field name spelling (case-sensitive)
- Verify the operator is appropriate for the field type
- Try a broader search first, then narrow down

### Unexpected results

- Ensure quotes are used for values with spaces
- Verify numeric comparisons use the correct operator direction
- Check that nested field paths are correct

## Quick Reference Card

```
Equals:           field=value
Not equals:       -field=value
Contains:         field:value
Greater:          field>value
Greater/equal:    field>=value  or  field=>value
Less:             field<value
Less/equal:       field<=value  or  field=<value
Quoted value:     field:"value with spaces"
Nested field:     parent.field=value
Multiple:         field1=value1 field2=value2
```

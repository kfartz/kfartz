# Understanding Relationships

Records in Kfartz are interconnected. Understanding these relationships helps you navigate data and maintain a complete research trail.

## The Data Flow

Data flows through Kfartz following the crystallography workflow:

```
Crystal
   |
   v
Measurement
   |
   v
Processing
   |
   v
Refinement  <---> Previous Refinement (optional)
   |
   v
Publication
```

## Relationship Types

### One-to-Many

A single parent record can have multiple child records:

- One **crystal** can have many **measurements**
- One **measurement** can have many **processings**
- One **processing** can be referenced by many **refinements**

### Many-to-One

Child records reference a single parent:

- Each **measurement** references exactly one **crystal**
- Each **processing** references exactly one **measurement**

### Many-to-Many

Some records can link to multiple related records:

- A **refinement** can reference multiple **processings** (e.g., merging data from multiple experiments)
- A **publication** can reference multiple **refinements**

### Self-Reference

Refinements can reference other refinements:

- A **refinement** can optionally reference a **previous refinement**, creating a chain that tracks iterative refinement history

## Practical Examples

### Tracing Back to Source

Starting from a publication, you can trace back:

1. Publication shows linked refinements
2. Each refinement shows its processings
3. Each processing shows its measurement
4. Each measurement shows its crystal

This provides complete provenance for published results.

### Finding Derived Work

Starting from a crystal, you can find all work built on it:

1. Search measurements for that crystal
2. Find processings linked to those measurements
3. Find refinements using those processings
4. Find publications including those refinements

### Refinement Chains

For iterative refinements:

1. Initial refinement has no previous refinement
2. Subsequent refinements reference their predecessor
3. The chain shows the evolution of the structure model

## Working with Relationships

### When Adding Records

Relationship fields appear as searchable dropdowns. Type to filter available options by name, then select the appropriate record.

### When Searching

Use dot notation to search by properties of related records:

```
crystal.source=synthetic
measurement.experiment_type=non-ambient
```

## Next Steps

- Review [search syntax](searching.md) for querying relationships
- See the [overview](../getting-started/overview.md) for collection details

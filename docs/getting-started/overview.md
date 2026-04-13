# Overview

Kfartz is a database application for managing crystallography measurement metadata. It provides a web-based interface for storing and querying data throughout the crystal structure determination workflow.

## Data Model

Kfartz organizes data into five interconnected collections that follow the typical crystallography workflow:

```
Crystal --> Measurement --> Processing --> Refinement --> Publication
```

### Collections

**Crystals**
Physical sample information including source, dimensions, color, and shape.

**Measurements**
Diffraction experiment data including PI, operator, facility, date, experiment type, and diffraction parameters. Non-ambient experiments include additional fields for pressure, chamber type, and pressure medium.

**Processings**
Data reduction records linking measurements to processed reflection data, including author and data location.

**Refinements**
Structure refinement results including cell parameters, space group, chemical formula, R-factors, and atom model type (IAM, TAAM, HAR). Refinements can reference multiple processings and track iterative refinement chains.

**Publications**
Publication records with DOI, linked to associated refinements.

### Supporting Data

**Chamber Types**
Predefined pressure chamber configurations for non-ambient experiments. Only administrators can create new chamber types.

## Data Relationships

Records link together through relationship fields:

- A **measurement** references the **crystal** that was measured
- A **processing** references the **measurement** that produced the data
- A **refinement** references one or more **processings** and optionally a previous **refinement**
- A **publication** references one or more **refinements**

This structure allows you to trace any result back to its source crystal, and find all downstream work from any starting point.

## Next Steps

- [Log in](logging-in.md) to access the application
- [Learn to navigate](navigation.md) the interface

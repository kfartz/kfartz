# Glossary

Application-specific terms used in Kfartz.

## Collections

**Crystal**
A record representing a physical crystal sample, including its physical properties and origin.

**Measurement**
A record of a diffraction experiment performed on a crystal, including experimental parameters and conditions.

**Processing**
A record of data reduction performed on measurement data, linking raw diffraction data to processed reflections.

**Refinement**
A record of structure refinement results, including cell parameters, space group, and quality metrics.

**Publication**
A record linking refinements to their published DOI.

**Chamber Type**
A predefined pressure chamber configuration used for non-ambient experiments.

## Fields

**Atom Model Type**
The electron density model used in refinement:
- **IAM** - Independent Atom Model
- **TAAM** - Transferable Aspherical Atom Model
- **HAR** - Hirshfeld Atom Refinement

**Experiment Type**
The type of diffraction experiment:
- **Single crystal** - Standard single-crystal diffraction
- **Powder** - Powder diffraction
- **Non-ambient** - High-pressure or non-standard conditions

**Previous Refinement**
A reference to an earlier refinement in an iterative refinement chain, allowing tracking of structure model evolution.

**Relationship Field**
A field that links to a record in another collection, creating a connection between related data.

## User Roles

**Regular User**
A user who can view all data and create new records, but cannot edit or delete existing records.

**Administrator**
A user with full access, including the ability to edit records, delete records, manage users, and create chamber types.

## Interface Terms

**Admin Panel**
The Payload CMS administrative interface at `/admin`, providing full database management capabilities for administrators.

**Insert Page**
The form page for creating new records in a collection.

**Table Switcher**
The dialog opened with `Ctrl+K` / `Cmd+K` for quickly navigating between collections.

**Infinite Scroll**
The pagination method where additional records load automatically as you scroll down the table.

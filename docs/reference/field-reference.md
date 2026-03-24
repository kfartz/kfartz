# Field Reference

Complete list of fields available in each collection.

## Crystals

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | text | Yes | Origin of the crystal (e.g., synthetic, natural) |
| `name` | text | No | Crystal name or identifier |
| `dimensions.max` | number | Yes | Maximum dimension (mm) |
| `dimensions.mid` | number | Yes | Middle dimension (mm) |
| `dimensions.min` | number | Yes | Minimum dimension (mm) |
| `color.a` | select | No | Color modifier (clear, dull, metallic, opalescent) |
| `color.b` | select | No | Color shade (light, dark, whitish, blackish, etc.) |
| `color.c` | select | Yes | Primary color (colorless, black, white, grey, etc.) |
| `shape` | select | Yes | Crystal shape (block, plate, needle, prism, etc.) |

## Measurements

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `crystal` | relationship | Yes | Link to crystal record |
| `name` | text | No | Measurement name or identifier |
| `data_location` | text | Yes | Location of measurement data |
| `pi_name` | text | Yes | Principal investigator name |
| `grant_id` | text | No | Associated grant identifier |
| `operator_name` | text | Yes | Person who performed measurement |
| `facility_name` | text | Yes | Facility where measurement was taken |
| `measurement_starting_date` | date | Yes | Date measurement began |
| `experiment_type` | select | Yes | Type of experiment (single crystal, powder, non-ambient) |
| `_diffrn_ambient_temperature.value` | number | No | Ambient temperature value |
| `_diffrn_ambient_temperature.uncertainty` | number | No | Temperature uncertainty |
| `_diffrn_radiation_probe` | text | Yes | Radiation probe type |
| `_diffrn_radiation_wavelength` | number | No | Radiation wavelength |
| `_diffrn_measurement_device_type` | text | No | Measurement device type |
| `_diffrn_detector_type` | text | No | Detector type |
| `_diffrn_reflns_theta_max` | number | No | Maximum theta angle |
| `resolution` | number | No | Calculated resolution (virtual field) |
| `pressure` | number | Conditional | Pressure in GPa (required for non-ambient) |
| `pressure_measurement_location` | text | Conditional | Where pressure was measured (required for non-ambient) |
| `chamber_type` | relationship | Conditional | Link to chamber type (required for non-ambient) |
| `opening_angle` | select | Conditional | Opening angle (30, 40, 50) (required for non-ambient) |
| `pressure_medium` | text | Conditional | Pressure medium used (required for non-ambient) |
| `comment` | textarea | No | Additional notes (max 500 chars) |
| `doi` | text | No | Associated DOI |

## Processings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `author` | text | Yes | Processing author |
| `measurement` | relationship | Yes | Link to measurement record |
| `name` | text | No | Processing name or identifier |
| `data_location` | text | Yes | Location of processing data |
| `_diffrn_reflns_av_R_equivalents` | number | No | Average R equivalents |
| `_diffrn_reflns_av_sigmaI_netI` | number | No | Average sigma I / net I |
| `_diffrn_reflns_theta_min` | number | No | Minimum theta angle |
| `_diffrn_reflns_theta_max` | number | No | Maximum theta angle |
| `comment` | textarea | No | Additional notes (max 500 chars) |

## Refinements

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `author` | text | Yes | Refinement author |
| `name` | text | No | Refinement name or identifier |
| `processings` | array | Yes | Links to processing records (min 1) |
| `previous_refinements` | array | No | Links to previous refinement records |
| `data_location` | text | Yes | Location of refinement data |
| `disorder` | checkbox | Yes | Whether disorder is present |
| `solvent_masking` | checkbox | Yes | Whether solvent masking was applied |
| `aspherical_atom_model` | select | Yes | Atom model type (IAM, TAAM, HAR) |
| `_chemical_formula_sum` | text | No | Chemical formula sum |
| `_space_group_name_H-M_alt` | text | No | Space group name |
| `_cell_length_a.value` | number | No | Cell length a value |
| `_cell_length_a.uncertainty` | number | No | Cell length a uncertainty |
| `_cell_length_b.value` | number | No | Cell length b value |
| `_cell_length_b.uncertainty` | number | No | Cell length b uncertainty |
| `_cell_length_c.value` | number | No | Cell length c value |
| `_cell_length_c.uncertainty` | number | No | Cell length c uncertainty |
| `_cell_angle_alpha.value` | number | No | Cell angle alpha value |
| `_cell_angle_alpha.uncertainty` | number | No | Cell angle alpha uncertainty |
| `_cell_angle_beta.value` | number | No | Cell angle beta value |
| `_cell_angle_beta.uncertainty` | number | No | Cell angle beta uncertainty |
| `_cell_angle_gamma.value` | number | No | Cell angle gamma value |
| `_cell_angle_gamma.uncertainty` | number | No | Cell angle gamma uncertainty |
| `_cell_volume.value` | number | No | Cell volume value |
| `_cell_volume.uncertainty` | number | No | Cell volume uncertainty |
| `_diffrn_reflns_av_R_equivalents` | number | No | Average R equivalents |
| `_diffrn_reflns_Laue_measured_fraction_full` | number | No | Laue measured fraction |
| `_refine_ls_R_factor_gt` | number | No | R factor (gt) |
| `_refine_ls_wR_factor_ref` | number | No | Weighted R factor |
| `comment` | textarea | No | Additional notes (max 500 chars) |
| `final` | checkbox | No | Whether this is a final refinement |

## Publications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `doi` | text | Yes | Publication DOI |
| `refinements` | array | Yes | Links to refinement records (min 1) |
| `name` | text | No | Publication name or identifier |

## Chamber Types

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | text | Yes | Chamber type name |

## Field Types

| Type | Description |
|------|-------------|
| text | Free-form text input |
| number | Numeric value |
| select | Choice from predefined options |
| checkbox | Boolean true/false value |
| date | Date value |
| textarea | Multi-line text input |
| relationship | Link to another record |
| array | List of related items |

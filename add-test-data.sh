#!/bin/sh

if [ $# != 3 ]; then
  echo 'Usage: add-test-data.sh <URL> <EMAIL> <PASSWORD>'
  exit 1
fi

echo_stderr() {
  echo "$@" >&2
}

URL=$1
EMAIL=$2
PASSWORD=$3

TOKEN=$(curl -s -X POST \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  "$URL/api/users/login" | jq -r '.token')

_post_data() {
  COLLECTION=$1
  DATA=$2
  echo_stderr "POST $COLLECTION"
  curl -s -X POST \
    -H 'Content-Type: application/json' \
    --cookie "payload-token=$TOKEN" \
    -d "$DATA" \
    "$URL/api/$COLLECTION"
}

post_data() {
  _post_data "$@" >/dev/null
}

post_data_get_id() {
  _post_data "$@" | jq -r '.doc.id'
}

echo "=== Chamber types ==="

post_data chamber-types '{"name":"diamond anvil cell"}'
post_data chamber-types '{"name":"gas pressure cell"}'
post_data chamber-types '{"name":"helium cryostat"}'
post_data chamber-types '{"name":"capillary"}'

echo "=== Crystals ==="

post_data crystals '{
  "source":"natural",
  "id":"xtal-001",
  "dimensions":{"max":3.2,"mid":1.4,"min":0.8},
  "color":{"a":"clear","b":"light","c":"colorless"},
  "shape":"block"
}'

post_data crystals '{
  "source":"synthetic",
  "id":"xtal-002",
  "dimensions":{"max":5.0,"mid":2.1,"min":1.9},
  "color":{"a":"metallic","b":"dark","c":"grey"},
  "shape":"plate"
}'

post_data crystals '{
  "source":"hydrothermal growth",
  "id":"xtal-003",
  "dimensions":{"max":0.9,"mid":0.4,"min":0.2},
  "color":{"a":"opalescent","b":"blueish","c":"blue"},
  "shape":"needle"
}'

post_data crystals '{
  "source":"flux growth",
  "id":"xtal-004",
  "dimensions":{"max":2.5,"mid":2.4,"min":2.3},
  "color":{"a":"dull","b":"reddish","c":"red"},
  "shape":"cube"
}'

echo "=== Measurements ==="

# single-crystal
M1=$(post_data_get_id measurements '{
  "crystal":"xtal-001",
  "pi_name":"Dr. Ada Lovelace",
  "grant_id":"NSF-CRYSTAL-001",
  "operator_name":"Bob Beamline",
  "facility_name":"Diamond Light Source",
  "measurement_starting_date":"2021-06-12",
  "experiment_type":"single crystal",
  "_diffrn_radiation_wavelength":0.71073,
  "_diffrn_reflns_theta_max":32.5,
  "comment":"Baseline single-crystal dataset."
  }')

# powder
M2=$(post_data_get_id measurements '{
  "crystal":"xtal-002",
  "pi_name":"Dr. Marie Curie",
  "grant_id":"EU-H2020-POWDER",
  "operator_name":"Alice Diffract",
  "facility_name":"ESRF",
  "measurement_starting_date":"2022-03-04",
  "experiment_type":"powder",
  "_diffrn_radiation_wavelength":1.5406,
  "_diffrn_reflns_theta_max":28.0
  }')

# non-ambient
M3=$(post_data_get_id measurements '{
  "crystal":"xtal-003",
  "pi_name":"Dr. Max Planck",
  "grant_id":"DFG-HIGH-P",
  "operator_name":"Charlie Clamp",
  "facility_name":"PETRA III",
  "measurement_starting_date":"2023-11-19",
  "experiment_type":"non-ambient",
  "pressure":12.4,
  "pressure_measurement_location":"ruby fluorescence near sample",
  "chamber_type":1,
  "opening_angle":"40",
  "pressure_medium":"neon",
  "_diffrn_radiation_wavelength":0.4959,
  "_diffrn_reflns_theta_max":25.0,
  "comment":"High-pressure DAC experiment."
  }')

echo "=== Processings ==="

post_data processings "{
  \"author\":\"Chad Refinerson\",
  \"measurement\":$M1,
  \"_diffrn_reflns_theta_min\":3.0,
  \"_diffrn_reflns_theta_max\":32.5,
  \"comment\":\"Standard integration and scaling.\"
}"

post_data processings "{
  \"author\":\"Dana Reduce\",
  \"measurement\":$M2,
  \"_diffrn_reflns_av_R_equivalents\":0.045,
  \"_diffrn_reflns_av_sigmaI_netI\":1.9
}"

post_data processings "{
  \"author\":\"Eve Pipeline\",
  \"measurement\":$M3,
  \"_diffrn_reflns_theta_min\":4.2,
  \"_diffrn_reflns_theta_max\":25.0,
  \"comment\":\"Corrected for diamond absorption.\"
}"

echo "=== Publications ==="

post_data publications '{"doi":"10.1000/xyz123"}'
post_data publications '{"doi":"10.5555/highpressure.2023.42"}'
post_data publications '{"doi":"10.4242/powder.diffraction.007"}'

echo "=== Refinements ==="

post_data refinements '{
  "author":"Frank Structure",
  "next_refinements":[],
  "disorder":false,
  "solvent_masking":false,
  "aspherical_atom_model":"IAM",
  "_chemical_formula_sum":"C10 H12 O4",
  "_space_group_name_H-M_alt":"P 21/c",
  "_cell_length_a":{"measurement":10.123,"uncertainty":0.002},
  "_cell_length_b":{"measurement":8.456,"uncertainty":0.001},
  "_cell_length_c":{"measurement":12.789,"uncertainty":0.003},
  "_cell_angle_alpha":{"measurement":90,"uncertainty":0},
  "_cell_angle_beta":{"measurement":101.23,"uncertainty":0.02},
  "_cell_angle_gamma":{"measurement":90,"uncertainty":0},
  "_cell_volume":{"measurement":1075.3,"uncertainty":0.5},
  "_refine_ls_R_factor_gt":0.032,
  "_refine_ls_wR_factor_ref":0.081,
  "final":true
}'

post_data refinements '{
  "author":"Grace Electron",
  "next_refinements":[{"refinement":1}],
  "disorder":true,
  "solvent_masking":true,
  "aspherical_atom_model":"TAAM",
  "_chemical_formula_sum":"Fe2 O3",
  "_space_group_name_H-M_alt":"R -3 c",
  "_cell_length_a":{"measurement":5.038,"uncertainty":0.001},
  "_cell_length_c":{"measurement":13.772,"uncertainty":0.004},
  "_cell_volume":{"measurement":302.1,"uncertainty":0.3},
  "_refine_ls_R_factor_gt":0.041,
  "_refine_ls_wR_factor_ref":0.097,
  "comment":"TAAM significantly improves residual density.",
  "final":false
}'

echo "=== Done ==="

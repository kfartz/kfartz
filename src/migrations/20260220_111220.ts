import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_crystals_color_a" AS ENUM('clear', 'dull', 'metallic', 'opalescent');
  CREATE TYPE "public"."enum_crystals_color_b" AS ENUM('light', 'dark', 'whitish', 'blackish', 'greyish', 'brownish', 'yellowish', 'reddish', 'blueish', 'greenish', 'pinkish', 'orangeish');
  CREATE TYPE "public"."enum_crystals_color_c" AS ENUM('colorless', 'black', 'white', 'grey', 'brown', 'yellow', 'red', 'blue', 'green', 'pink', 'violet', 'orange');
  CREATE TYPE "public"."enum_crystals_shape" AS ENUM('block', 'plate', 'needle', 'prism', 'plank', 'irregular', 'cube', 'trapezoid', 'hexagonal', 'octahedral', 'rhobohedral', 'spherical');
  CREATE TYPE "public"."enum_measurements_experiment_type" AS ENUM('single crystal', 'powder', 'non-ambient');
  CREATE TYPE "public"."enum_measurements_opening_angle" AS ENUM('30', '40', '50');
  CREATE TYPE "public"."enum_refinements_aspherical_atom_model" AS ENUM('IAM', 'TAAM', 'HAR');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"admin" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "crystals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar NOT NULL,
  	"name" varchar,
  	"dimensions_max" numeric NOT NULL,
  	"dimensions_mid" numeric NOT NULL,
  	"dimensions_min" numeric NOT NULL,
  	"color_a" "enum_crystals_color_a",
  	"color_b" "enum_crystals_color_b",
  	"color_c" "enum_crystals_color_c" NOT NULL,
  	"shape" "enum_crystals_shape" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "measurements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"crystal_id" integer NOT NULL,
  	"name" varchar,
  	"pi_name" varchar NOT NULL,
  	"grant_id" varchar NOT NULL,
  	"operator_name" varchar NOT NULL,
  	"facility_name" varchar NOT NULL,
  	"measurement_starting_date" timestamp(3) with time zone NOT NULL,
  	"experiment_type" "enum_measurements_experiment_type" NOT NULL,
  	"_diffrn_ambient_temperature_measurement" numeric,
  	"_diffrn_ambient_temperature_uncertainty" numeric,
  	"_diffrn_radiation_probe" varchar,
  	"_diffrn_radiation_wavelength" numeric,
  	"_diffrn_measurement_device_type" varchar,
  	"_diffrn_detector_type" varchar,
  	"_diffrn_reflns_theta_max" numeric,
  	"pressure" numeric,
  	"pressure_measurement_location" varchar,
  	"chamber_type_id" integer,
  	"opening_angle" "enum_measurements_opening_angle",
  	"pressure_medium" varchar,
  	"comment" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "processings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"measurement_id" integer NOT NULL,
  	"name" varchar,
  	"_diffrn_reflns_av_r_equivalents" numeric,
  	"_diffrn_reflns_av_sigmai_neti" numeric,
  	"_diffrn_reflns_theta_min" numeric,
  	"_diffrn_reflns_theta_max" numeric,
  	"comment" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "refinements_next_refinements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"refinement_id" integer NOT NULL
  );
  
  CREATE TABLE "refinements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"name" varchar,
  	"disorder" boolean DEFAULT false NOT NULL,
  	"solvent_masking" boolean DEFAULT false NOT NULL,
  	"aspherical_atom_model" "enum_refinements_aspherical_atom_model" NOT NULL,
  	"_chemical_formula_sum" varchar,
  	"_space_group_name_h_m_alt" varchar,
  	"_cell_length_a_measurement" numeric,
  	"_cell_length_a_uncertainty" numeric,
  	"_cell_length_b_measurement" numeric,
  	"_cell_length_b_uncertainty" numeric,
  	"_cell_length_c_measurement" numeric,
  	"_cell_length_c_uncertainty" numeric,
  	"_cell_angle_alpha_measurement" numeric,
  	"_cell_angle_alpha_uncertainty" numeric,
  	"_cell_angle_beta_measurement" numeric,
  	"_cell_angle_beta_uncertainty" numeric,
  	"_cell_angle_gamma_measurement" numeric,
  	"_cell_angle_gamma_uncertainty" numeric,
  	"_cell_volume_measurement" numeric,
  	"_cell_volume_uncertainty" numeric,
  	"_diffrn_reflns_av_r_equivalents" numeric,
  	"_diffrn_reflns_laue_measured_fraction_full" numeric,
  	"_refine_ls_r_factor_gt" numeric,
  	"_refine_ls_wr_factor_ref" numeric,
  	"comment" varchar,
  	"final" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"doi" varchar NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chamber_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"crystals_id" integer,
  	"measurements_id" integer,
  	"processings_id" integer,
  	"refinements_id" integer,
  	"publications_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"crystals_id" integer,
  	"measurements_id" integer,
  	"processings_id" integer,
  	"refinements_id" integer,
  	"publications_id" integer,
  	"chamber_types_id" integer,
  	"search_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "measurements" ADD CONSTRAINT "measurements_crystal_id_crystals_id_fk" FOREIGN KEY ("crystal_id") REFERENCES "public"."crystals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "measurements" ADD CONSTRAINT "measurements_chamber_type_id_chamber_types_id_fk" FOREIGN KEY ("chamber_type_id") REFERENCES "public"."chamber_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "processings" ADD CONSTRAINT "processings_measurement_id_measurements_id_fk" FOREIGN KEY ("measurement_id") REFERENCES "public"."measurements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "refinements_next_refinements" ADD CONSTRAINT "refinements_next_refinements_refinement_id_refinements_id_fk" FOREIGN KEY ("refinement_id") REFERENCES "public"."refinements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "refinements_next_refinements" ADD CONSTRAINT "refinements_next_refinements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_crystals_fk" FOREIGN KEY ("crystals_id") REFERENCES "public"."crystals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_measurements_fk" FOREIGN KEY ("measurements_id") REFERENCES "public"."measurements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_processings_fk" FOREIGN KEY ("processings_id") REFERENCES "public"."processings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_refinements_fk" FOREIGN KEY ("refinements_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_crystals_fk" FOREIGN KEY ("crystals_id") REFERENCES "public"."crystals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_measurements_fk" FOREIGN KEY ("measurements_id") REFERENCES "public"."measurements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_processings_fk" FOREIGN KEY ("processings_id") REFERENCES "public"."processings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_refinements_fk" FOREIGN KEY ("refinements_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chamber_types_fk" FOREIGN KEY ("chamber_types_id") REFERENCES "public"."chamber_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "crystals_updated_at_idx" ON "crystals" USING btree ("updated_at");
  CREATE INDEX "crystals_created_at_idx" ON "crystals" USING btree ("created_at");
  CREATE INDEX "measurements_crystal_idx" ON "measurements" USING btree ("crystal_id");
  CREATE INDEX "measurements_chamber_type_idx" ON "measurements" USING btree ("chamber_type_id");
  CREATE INDEX "measurements_updated_at_idx" ON "measurements" USING btree ("updated_at");
  CREATE INDEX "measurements_created_at_idx" ON "measurements" USING btree ("created_at");
  CREATE INDEX "processings_measurement_idx" ON "processings" USING btree ("measurement_id");
  CREATE INDEX "processings_updated_at_idx" ON "processings" USING btree ("updated_at");
  CREATE INDEX "processings_created_at_idx" ON "processings" USING btree ("created_at");
  CREATE INDEX "refinements_next_refinements_order_idx" ON "refinements_next_refinements" USING btree ("_order");
  CREATE INDEX "refinements_next_refinements_parent_id_idx" ON "refinements_next_refinements" USING btree ("_parent_id");
  CREATE INDEX "refinements_next_refinements_refinement_idx" ON "refinements_next_refinements" USING btree ("refinement_id");
  CREATE INDEX "refinements_updated_at_idx" ON "refinements" USING btree ("updated_at");
  CREATE INDEX "refinements_created_at_idx" ON "refinements" USING btree ("created_at");
  CREATE INDEX "publications_updated_at_idx" ON "publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "publications" USING btree ("created_at");
  CREATE INDEX "chamber_types_updated_at_idx" ON "chamber_types" USING btree ("updated_at");
  CREATE INDEX "chamber_types_created_at_idx" ON "chamber_types" USING btree ("created_at");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_crystals_id_idx" ON "search_rels" USING btree ("crystals_id");
  CREATE INDEX "search_rels_measurements_id_idx" ON "search_rels" USING btree ("measurements_id");
  CREATE INDEX "search_rels_processings_id_idx" ON "search_rels" USING btree ("processings_id");
  CREATE INDEX "search_rels_refinements_id_idx" ON "search_rels" USING btree ("refinements_id");
  CREATE INDEX "search_rels_publications_id_idx" ON "search_rels" USING btree ("publications_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_crystals_id_idx" ON "payload_locked_documents_rels" USING btree ("crystals_id");
  CREATE INDEX "payload_locked_documents_rels_measurements_id_idx" ON "payload_locked_documents_rels" USING btree ("measurements_id");
  CREATE INDEX "payload_locked_documents_rels_processings_id_idx" ON "payload_locked_documents_rels" USING btree ("processings_id");
  CREATE INDEX "payload_locked_documents_rels_refinements_id_idx" ON "payload_locked_documents_rels" USING btree ("refinements_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_chamber_types_id_idx" ON "payload_locked_documents_rels" USING btree ("chamber_types_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "crystals" CASCADE;
  DROP TABLE "measurements" CASCADE;
  DROP TABLE "processings" CASCADE;
  DROP TABLE "refinements_next_refinements" CASCADE;
  DROP TABLE "refinements" CASCADE;
  DROP TABLE "publications" CASCADE;
  DROP TABLE "chamber_types" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_crystals_color_a";
  DROP TYPE "public"."enum_crystals_color_b";
  DROP TYPE "public"."enum_crystals_color_c";
  DROP TYPE "public"."enum_crystals_shape";
  DROP TYPE "public"."enum_measurements_experiment_type";
  DROP TYPE "public"."enum_measurements_opening_angle";
  DROP TYPE "public"."enum_refinements_aspherical_atom_model";`)
}

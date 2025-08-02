-- Custom SQL migration file, put your code below! --
CREATE
OR REPLACE VIEW "coursefull"."graded_student_deliverables" AS
SELECT
  "d"."id" AS "deliverable",
  "d"."course_id" AS "course",
  "d"."name" AS "name",
  "d"."weight" AS "weight",
  "sd"."mark" AS "mark",
  "sd"."user_id" AS "user_id",
  "sd"."completed_at" AS "completed_at",
  "sd"."notes" AS "notes",
  "d"."type" AS "type",
  "d"."public" AS "public",
  "d"."deadline" AS "deadline",
  "d"."starts_at" AS "starts_at"
FROM
  "coursefull"."student_deliverable" sd
  INNER JOIN "coursefull"."deliverable" d ON d.id = sd.deliverable_id
WHERE
  sd.complete = TRUE
  AND sd.mark IS NOT NULL;

--> statement-breakpoint
CREATE
OR REPLACE VIEW "coursefull"."student_grade_data" AS
SELECT
  gsd.user_id AS user_id,
  SUM(gsd.mark * gsd.weight) / SUM(gsd.weight) AS grade,
  SUM(gsd.weight) AS weight_completed,
  SUM(gsd.mark * gsd.weight) AS points_earned,
  gsd.course AS course
FROM
  "coursefull"."graded_student_deliverables" gsd
  INNER JOIN "coursefull"."course" c ON c.id = gsd.course
GROUP BY
  gsd.user_id,
  gsd.course;

--> statement-breakpoint
CREATE
OR REPLACE VIEW "coursefull"."student_course_grades" AS
SELECT
  -- TODO: Work out exactly what fields we need
  *
FROM
  "coursefull"."user_courses" uc
  INNER JOIN "coursefull"."course" c on uc.course_id = c.id;


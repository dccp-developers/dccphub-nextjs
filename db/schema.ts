import {
  pgTable,
  bigint,
  integer,
  text,
  varchar,
  timestamp,
  boolean,
  real,
  smallint,
  numeric,
  date,
  json,
  uuid,
  doublePrecision,
  time,
  pgEnum,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const clearanceStatusEnum = pgEnum("students_clearance_status", [
  "pending",
  "cleared",
  "not_cleared",
]);
export const subjectClassificationEnum = pgEnum("subject_classification", [
  "credited",
  "non_credited",
]);
export const facultyStatusEnum = pgEnum("faculty_status", [
  "active",
  "inactive",
  "on_leave",
]);
export const facultyGenderEnum = pgEnum("faculty_gender", [
  "male",
  "female",
  "other",
]);

// ============================================
// CORE STUDENT TABLES
// ============================================

export const students = pgTable("students", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  gender: varchar("gender", { length: 255 }).notNull(),
  birthDate: date("birth_date").notNull(),
  age: bigint("age", { mode: "number" }).notNull(),
  address: varchar("address", { length: 255 }),
  contacts: text("contacts"),
  courseId: bigint("course_id", { mode: "number" }).notNull(),
  academicYear: bigint("academic_year", { mode: "number" }),
  email: varchar("email", { length: 255 }),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  profileUrl: varchar("profile_url", { length: 255 }),
  studentContactId: bigint("student_contact_id", { mode: "number" }),
  studentParentInfo: bigint("student_parent_info", { mode: "number" }),
  studentEducationId: bigint("student_education_id", { mode: "number" }),
  studentPersonalId: bigint("student_personal_id", { mode: "number" }),
  documentLocationId: bigint("document_location_id", { mode: "number" }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  studentId: bigint("student_id", { mode: "number" }),
  status: varchar("status", { length: 255 }),
  clearanceStatus: varchar("clearance_status", { length: 255 }).default(
    "pending",
  ),
  yearGraduated: varchar("year_graduated", { length: 255 }),
  specialOrder: varchar("special_order", { length: 255 }),
  issuedDate: date("issued_date"),
  subjectEnrolled: json("subject_enrolled"),
  userId: integer("user_id"),
  institutionId: integer("institution_id"),
  lrn: varchar("lrn", { length: 255 }),
  studentType: varchar("student_type", { length: 255 }),
  ethnicity: varchar("ethnicity", { length: 255 }),
  cityOfOrigin: varchar("city_of_origin", { length: 255 }),
  provinceOfOrigin: varchar("province_of_origin", { length: 255 }),
  regionOfOrigin: varchar("region_of_origin", { length: 255 }),
  isIndigenousPerson: boolean("is_indigenous_person").notNull().default(false),
  indigenousGroup: varchar("indigenous_group", { length: 255 }),
  withdrawalDate: date("withdrawal_date"),
  withdrawalReason: text("withdrawal_reason"),
  attritionCategory: varchar("attrition_category", { length: 255 }),
  dropoutDate: date("dropout_date"),
  employmentStatus: varchar("employment_status", { length: 255 }),
  employerName: varchar("employer_name", { length: 255 }),
  jobPosition: varchar("job_position", { length: 255 }),
  employmentDate: date("employment_date"),
  employedByInstitution: boolean("employed_by_institution")
    .notNull()
    .default(false),
  scholarshipType: varchar("scholarship_type", { length: 255 }),
  scholarshipDetails: text("scholarship_details"),
});

export const studentContacts = pgTable("student_contacts", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  emergencyContactName: varchar("emergency_contact_name", { length: 255 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 255 }),
  emergencyContactAddress: varchar("emergency_contact_address", {
    length: 255,
  }),
  facebookContact: varchar("facebook_contact", { length: 255 }),
  personalContact: varchar("personal_contact", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
  studentId: bigint("student_id", { mode: "number" }),
});

export const studentParentsInfo = pgTable("student_parents_info", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  fathersName: varchar("fathers_name", { length: 255 }),
  mothersName: varchar("mothers_name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

export const studentEducationInfo = pgTable("student_education_info", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  elementarySchool: varchar("elementary_school", { length: 255 }),
  elementaryGraduateYear: bigint("elementary_graduate_year", {
    mode: "number",
  }),
  seniorHighName: varchar("senior_high_name", { length: 255 }),
  seniorHighGraduateYear: bigint("senior_high_graduate_year", {
    mode: "number",
  }),
  elementarySchoolAddress: varchar("elementary_school_address", {
    length: 255,
  }),
  seniorHighAddress: varchar("senior_high_address", { length: 255 }),
  juniorHighSchoolName: varchar("junior_high_school_name", { length: 255 }),
  juniorHighSchoolAddress: varchar("junior_high_school_address", {
    length: 255,
  }),
  juniorHighGraduationYear: varchar("junior_high_graduation_year", {
    length: 255,
  }),
});

export const studentsPersonalInfo = pgTable("students_personal_info", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  birthplace: varchar("birthplace", { length: 255 }),
  civilStatus: varchar("civil_status", { length: 255 }),
  citizenship: varchar("citizenship", { length: 255 }),
  religion: varchar("religion", { length: 255 }),
  weight: varchar("weight", { length: 255 }),
  height: varchar("height", { length: 255 }),
  currentAdress: varchar("current_adress", { length: 255 }), // Note: typo in DB
  permanentAddress: varchar("permanent_address", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

export const documentLocations = pgTable("document_locations", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  birthCertificate: varchar("birth_certificate", { length: 255 }),
  form138: varchar("form_138", { length: 255 }),
  form137: varchar("form_137", { length: 255 }),
  goodMoralCert: varchar("good_moral_cert", { length: 255 }),
  transferCredentials: varchar("transfer_credentials", { length: 255 }),
  transcriptRecords: varchar("transcript_records", { length: 255 }),
  picture1x1: varchar("picture_1x1", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

export const medicalRecords = pgTable("medical_records", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  studentId: bigint("student_id", { mode: "number" }).notNull(),
  recordType: varchar("record_type", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  prescription: text("prescription"),
  notes: text("notes"),
  doctorName: varchar("doctor_name", { length: 255 }),
  clinicName: varchar("clinic_name", { length: 255 }),
  clinicAddress: varchar("clinic_address", { length: 255 }),
  doctorContact: varchar("doctor_contact", { length: 255 }),
  visitDate: date("visit_date").notNull(),
  nextAppointment: date("next_appointment"),
  followUpDate: date("follow_up_date"),
  status: varchar("status", { length: 255 }).notNull().default("active"),
  priority: varchar("priority", { length: 255 }).notNull().default("normal"),
  isConfidential: boolean("is_confidential").notNull().default(false),
  height: numeric("height"),
  weight: numeric("weight"),
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  temperature: numeric("temperature"),
  heartRate: integer("heart_rate"),
  bmi: numeric("bmi"),
  vitalSigns: json("vital_signs"),
  labResults: json("lab_results"),
  attachments: json("attachments"),
  emergencyContactNotified: boolean("emergency_contact_notified")
    .notNull()
    .default(false),
  emergencyNotificationSentAt: timestamp("emergency_notification_sent_at", {
    withTimezone: false,
  }),
  createdBy: bigint("created_by", { mode: "number" }),
  updatedBy: bigint("updated_by", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
  deletedAt: timestamp("deleted_at", { withTimezone: false }),
});

// ============================================
// ENROLLMENT & ACADEMIC TABLES
// ============================================

export const studentEnrollment = pgTable("student_enrollment", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  studentId: varchar("student_id", { length: 255 }).notNull(),
  courseId: varchar("course_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  semester: bigint("semester", { mode: "number" }),
  academicYear: bigint("academic_year", { mode: "number" }),
  schoolYear: varchar("school_year", { length: 255 }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  downpayment: real("downpayment").default(0),
  remarks: text("remarks"),
  paymentMethod: varchar("payment_method", { length: 255 }),
});

export const pendingEnrollments = pgTable("pending_enrollments", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  data: json("data").notNull(),
  status: varchar("status", { length: 255 }).notNull().default("pending"),
  remarks: text("remarks"),
  approvedBy: bigint("approved_by", { mode: "number" }),
  processedAt: timestamp("processed_at", { withTimezone: false }),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

export const guestEnrollments = pgTable("guest_enrollments", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  selectedCourse: bigint("selected_course", { mode: "number" }),
  academicYear: bigint("academic_year", { mode: "number" }),
  selectedSemester: bigint("selected_semester", { mode: "number" }),
  geustEducationId: bigint("geust_education_id", { mode: "number" }), // Note: typo in DB
  specialSkills: text("special_skills"),
  guestParentsId: bigint("guest_parents_id", { mode: "number" }),
  guestGuardianId: bigint("guest_guardian_id", { mode: "number" }),
  guestDocumentsId: bigint("guest_documents_id", { mode: "number" }),
  guestTuitionId: bigint("guest_tuition_id", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  studentId: bigint("student_id", { mode: "number" }),
  guestEmail: varchar("guest_email", { length: 255 }),
  status: varchar("status", { length: 255 }),
  selectedSubjects: bigint("selected_subjects", { mode: "number" }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  type: varchar("type", { length: 255 }),
  guestPersonalInfoId: bigint("guest_personal_info_id", { mode: "number" }),
  downpayment: bigint("downpayment", { mode: "number" }),
  schoolYear: varchar("school_year", { length: 255 }),
  semester: varchar("semester", { length: 255 }),
});

// ============================================
// COURSES & SUBJECTS
// ============================================

export const courses = pgTable("courses", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  lecPerUnit: bigint("lec_per_unit", { mode: "number" }),
  labPerUnit: bigint("lab_per_unit", { mode: "number" }),
  remarks: text("remarks"),
  curriculumYear: varchar("curriculum_year", { length: 255 }),
  miscelaneous: integer("miscelaneous"),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
  units: integer("units").notNull().default(0),
  yearLevel: integer("year_level").notNull().default(1),
  semester: integer("semester").notNull().default(1),
  schoolYear: varchar("school_year", { length: 255 }),
  miscellaneous: varchar("miscellaneous", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
});

export const subject = pgTable("subject", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  classification: varchar("classification", { length: 255 })
    .notNull()
    .default("non_credited"),
  code: varchar("code", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  units: bigint("units", { mode: "number" }),
  lecture: bigint("lecture", { mode: "number" }),
  laboratory: bigint("laboratory", { mode: "number" }),
  preRequisite: text("pre_riquisite"), // Note: typo in DB
  academicYear: bigint("academic_year", { mode: "number" }),
  semester: bigint("semester", { mode: "number" }),
  courseId: bigint("course_id", { mode: "number" }),
  group: varchar("group", { length: 255 }),
  isCredited: boolean("is_credited").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
  description: varchar("description", { length: 255 }),
  name: varchar("name", { length: 255 }),
});

export const subjectEnrollments = pgTable("subject_enrollments", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  subjectId: bigint("subject_id", { mode: "number" }),
  classId: integer("class_id"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  grade: real("grade"),
  instructor: varchar("instructor", { length: 255 }),
  studentId: integer("student_id"),
  academicYear: varchar("academic_year", { length: 255 }),
  schoolYear: varchar("school_year", { length: 255 }),
  semester: smallint("semester"),
  enrollmentId: smallint("enrollment_id"),
  remarks: varchar("remarks", { length: 255 }),
  classification: varchar("classification", { length: 255 }),
  schoolName: varchar("school_name", { length: 255 }),
  isCredited: boolean("is_credited").notNull().default(false),
  creditedSubjectId: smallint("credited_subject_id"),
  section: varchar("section", { length: 255 }),
  isModular: boolean("is_modular").notNull().default(false),
  lectureFee: numeric("lecture_fee"),
  laboratoryFee: numeric("laboratory_fee"),
  enrolledLectureUnits: integer("enrolled_lecture_units"),
  enrolledLaboratoryUnits: integer("enrolled_laboratory_units"),
  externalSubjectCode: varchar("external_subject_code", { length: 255 }),
  externalSubjectTitle: varchar("external_subject_title", { length: 255 }),
  externalSubjectUnits: integer("external_subject_units"),
});

export const creditedEnrolledSubjects = pgTable("credited_enrolled_subjects", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ============================================
// CLASSES & SCHEDULES
// ============================================

export const classes = pgTable("classes", {
  id: integer("id").primaryKey().notNull(),
  subjectCode: varchar("subject_code", { length: 255 }),
  facultyId: uuid("faculty_id"),
  academicYear: varchar("academic_year", { length: 255 }),
  semester: varchar("semester", { length: 255 }),
  scheduleId: integer("schedule_id"),
  schoolYear: varchar("school_year", { length: 255 }),
  courseCodes: varchar("course_codes", { length: 255 }),
  section: varchar("section", { length: 255 }),
  roomId: smallint("room_id"),
  classification: varchar("classification", { length: 255 }),
  maximumSlots: smallint("maximum_slots").default(50),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
  shsTrackId: bigint("shs_track_id", { mode: "number" }),
  shsStrandId: bigint("shs_strand_id", { mode: "number" }),
  gradeLevel: varchar("grade_level", { length: 255 }),
  subjectId: bigint("subject_id", { mode: "number" }),
  subjectIds: json("subject_ids"),
});

export const classEnrollments = pgTable("class_enrollments", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  classId: bigint("class_id", { mode: "number" }).notNull(),
  studentId: numeric("student_id").notNull(),
  completionDate: date("completion_date"),
  status: boolean("status").notNull().default(true),
  remarks: text("remarks"),
  prelimGrade: numeric("prelim_grade"),
  midtermGrade: numeric("midterm_grade"),
  finalsGrade: numeric("finals_grade"),
  totalAverage: numeric("total_average"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  isGradesFinalized: boolean("is_grades_finalized").notNull().default(false),
  isGradesVerified: boolean("is_grades_verified").notNull().default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at", { withTimezone: false }),
  verificationNotes: text("verification_notes"),
});

export const schedule = pgTable("schedule", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  dayOfWeek: varchar("day_of_week", { length: 255 }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  classId: bigint("class_id", { mode: "number" }),
  roomId: bigint("room_id", { mode: "number" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const rooms = pgTable("rooms", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  classCode: varchar("class_code", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ============================================
// ATTENDANCE
// ============================================

export const attendances = pgTable("attendances", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  classEnrollmentId: bigint("class_enrollment_id", {
    mode: "number",
  }).notNull(),
  studentId: bigint("student_id", { mode: "number" }).notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 255 }).notNull().default("present"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  classId: bigint("class_id", { mode: "number" }).notNull(),
  remarks: text("remarks"),
  markedAt: timestamp("marked_at", { withTimezone: false }),
  markedBy: uuid("marked_by"),
  ipAddress: varchar("ip_address", { length: 255 }),
  locationData: json("location_data"),
  deletedAt: timestamp("deleted_at", { withTimezone: false }),
});

// ============================================
// FACULTY
// ============================================

export const faculty = pgTable("faculty", {
  id: uuid("id").primaryKey().notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }),
  department: varchar("department", { length: 255 }),
  officeHours: varchar("office_hours", { length: 255 }),
  birthDate: date("birth_date"),
  addressLine1: varchar("address_line1", { length: 255 }),
  biography: text("biography"),
  education: text("education"),
  coursesTaught: text("courses_taught"),
  photoUrl: varchar("photo_url", { length: 255 }),
  status: varchar("status", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  gender: varchar("gender", { length: 255 }),
  age: bigint("age", { mode: "number" }),
  password: varchar("password", { length: 255 }),
  rememberToken: varchar("remember_token", { length: 100 }),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: false }),
  facultyCode: varchar("faculty_code", { length: 20 }),
  facultyIdNumber: varchar("faculty_id_number", { length: 20 }),
  fullName: varchar("full_name", { length: 255 }),
});

// ============================================
// DEPARTMENTS & SCHOOLS
// ============================================

export const schools = pgTable("schools", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  description: text("description"),
  deanName: varchar("dean_name", { length: 255 }),
  deanEmail: varchar("dean_email", { length: 255 }),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  metadata: json("metadata"),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

export const departments = pgTable("departments", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  schoolId: bigint("school_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  description: text("description"),
  headName: varchar("head_name", { length: 255 }),
  headEmail: varchar("head_email", { length: 255 }),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  metadata: json("metadata"),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

// ============================================
// FINANCIAL
// ============================================

export const studentTuition = pgTable("student_tuition", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  totalTuition: real("total_tuition"),
  totalBalance: real("total_balance"),
  totalLectures: real("total_lectures"),
  totalLaboratory: real("total_laboratory"),
  totalMiscelaneousFees: real("total_miscelaneous_fees"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: date("updated_at"),
  status: varchar("status", { length: 255 }),
  semester: bigint("semester", { mode: "number" }),
  schoolYear: varchar("school_year", { length: 255 }),
  academicYear: bigint("academic_year", { mode: "number" }),
  studentId: bigint("student_id", { mode: "number" }),
  enrollmentId: bigint("enrollment_id", { mode: "number" }),
  discount: bigint("discount", { mode: "number" }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  overallTuition: real("overall_tuition"),
  paid: bigint("paid", { mode: "number" }),
  downpayment: doublePrecision("downpayment"),
  dueDate: date("due_date"),
  paymentMethod: varchar("payment_method", { length: 255 }),
  originalLectures: doublePrecision("original_lectures"),
});

export const studentTransactions = pgTable("student_transactions", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  studentId: bigint("student_id", { mode: "number" }).notNull(),
  transactionId: bigint("transaction_id", { mode: "number" }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  amount: integer("amount"),
});

export const studentClearances = pgTable("student_clearances", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  studentId: bigint("student_id", { mode: "number" }).notNull(),
  academicYear: varchar("academic_year", { length: 255 }).notNull(),
  semester: smallint("semester").notNull(),
  isCleared: boolean("is_cleared").notNull().default(false),
  remarks: text("remarks"),
  clearedBy: varchar("cleared_by", { length: 255 }),
  clearedAt: timestamp("cleared_at", { withTimezone: false }),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

// ============================================
// SENIOR HIGH SCHOOL (SHS) TABLES
// ============================================

export const shsStudents = pgTable("shs_students", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  studentLrn: varchar("student_lrn", { length: 255 }),
  fullname: varchar("fullname", { length: 255 }),
  civilStatus: varchar("civil_status", { length: 255 }),
  religion: varchar("religion", { length: 255 }),
  nationality: varchar("nationality", { length: 255 }),
  birthdate: varchar("birthdate", { length: 11 }),
  guardianName: varchar("guardian_name", { length: 255 }),
  guardianContact: varchar("guardian_contact", { length: 255 }),
  studentContact: varchar("student_contact", { length: 255 }),
  completeAddress: varchar("complete_address", { length: 255 }),
  gradeLevel: varchar("grade_level", { length: 255 }),
  track: varchar("track", { length: 255 }),
  gender: varchar("gender", { length: 255 }),
  email: varchar("email", { length: 255 }),
  remarks: varchar("remarks", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  strandId: bigint("strand_id", { mode: "number" }),
  trackId: bigint("track_id", { mode: "number" }),
});

export const shsTracks = pgTable("shs_tracks", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  trackName: varchar("track_name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const shsStrands = pgTable("shs_strands", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  trackId: bigint("track_id", { mode: "number" }).notNull(),
  strandName: varchar("strand_name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: false }),
  updatedAt: timestamp("updated_at", { withTimezone: false }),
});

export const strandSubjects = pgTable("strand_subjects", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  gradeYear: varchar("grade_year", { length: 255 }).notNull(),
  semester: varchar("semester", { length: 255 }).notNull(),
  strandId: bigint("strand_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

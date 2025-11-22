import { db } from "./drizzle";
import {
  students,
  studentContacts,
  studentParentsInfo,
  studentEducationInfo,
  studentsPersonalInfo,
  documentLocations,
  medicalRecords,
  studentEnrollment,
  courses,
  subject,
  subjectEnrollments,
  classes,
  classEnrollments,
  attendances,
  faculty,
  schedule,
  rooms,
  departments,
  schools,
  studentTuition,
  studentClearances,
  shsStudents,
  shsStrands,
  shsTracks,
  strandSubjects,
  pendingEnrollments,
  guestEnrollments
} from "./schema";
import { eq, and, desc, asc, sql, inArray, like, gte, lte, isNull, isNotNull } from "drizzle-orm";

// ============================================
// TYPE DEFINITIONS
// ============================================

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

export type StudentContact = typeof studentContacts.$inferSelect;
export type NewStudentContact = typeof studentContacts.$inferInsert;

export type StudentParentInfo = typeof studentParentsInfo.$inferSelect;
export type NewStudentParentInfo = typeof studentParentsInfo.$inferInsert;

export type StudentEducationInfo = typeof studentEducationInfo.$inferSelect;
export type NewStudentEducationInfo = typeof studentEducationInfo.$inferInsert;

export type StudentPersonalInfo = typeof studentsPersonalInfo.$inferSelect;
export type NewStudentPersonalInfo = typeof studentsPersonalInfo.$inferInsert;

export type DocumentLocation = typeof documentLocations.$inferSelect;
export type NewDocumentLocation = typeof documentLocations.$inferInsert;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type NewMedicalRecord = typeof medicalRecords.$inferInsert;

export type Enrollment = typeof studentEnrollment.$inferSelect;
export type NewEnrollment = typeof studentEnrollment.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type Subject = typeof subject.$inferSelect;
export type NewSubject = typeof subject.$inferInsert;

export type SubjectEnrollment = typeof subjectEnrollments.$inferSelect;
export type NewSubjectEnrollment = typeof subjectEnrollments.$inferInsert;

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

export type ClassEnrollment = typeof classEnrollments.$inferSelect;
export type NewClassEnrollment = typeof classEnrollments.$inferInsert;

export type Attendance = typeof attendances.$inferSelect;
export type NewAttendance = typeof attendances.$inferInsert;

export type Faculty = typeof faculty.$inferSelect;
export type NewFaculty = typeof faculty.$inferInsert;

export type Schedule = typeof schedule.$inferSelect;
export type NewSchedule = typeof schedule.$inferInsert;

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;

export type StudentTuition = typeof studentTuition.$inferSelect;
export type NewStudentTuition = typeof studentTuition.$inferInsert;

export type StudentClearance = typeof studentClearances.$inferSelect;
export type NewStudentClearance = typeof studentClearances.$inferInsert;

export type SHSStudent = typeof shsStudents.$inferSelect;
export type NewSHSStudent = typeof shsStudents.$inferInsert;

// ============================================
// STUDENT QUERIES
// ============================================

/**
 * Get a complete student profile with all related information
 */
export async function getStudentProfile(studentId: number) {
  const student = await db.query.students.findFirst({
    where: eq(students.id, studentId),
  });

  if (!student) return null;

  const [contact, parentInfo, educationInfo, personalInfo, docs] = await Promise.all([
    student.studentContactId
      ? db.query.studentContacts.findFirst({ where: eq(studentContacts.id, student.studentContactId) })
      : null,
    student.studentParentInfo
      ? db.query.studentParentsInfo.findFirst({ where: eq(studentParentsInfo.id, student.studentParentInfo) })
      : null,
    student.studentEducationId
      ? db.query.studentEducationInfo.findFirst({ where: eq(studentEducationInfo.id, student.studentEducationId) })
      : null,
    student.studentPersonalId
      ? db.query.studentsPersonalInfo.findFirst({ where: eq(studentsPersonalInfo.id, student.studentPersonalId) })
      : null,
    student.documentLocationId
      ? db.query.documentLocations.findFirst({ where: eq(documentLocations.id, student.documentLocationId) })
      : null,
  ]);

  return {
    student,
    contact,
    parentInfo,
    educationInfo,
    personalInfo,
    documents: docs,
  };
}

/**
 * Get all active students
 */
export async function getActiveStudents() {
  return db.select()
    .from(students)
    .where(isNull(students.deletedAt))
    .orderBy(desc(students.createdAt));
}

/**
 * Get students by course
 */
export async function getStudentsByCourse(courseId: number) {
  return db.select()
    .from(students)
    .where(and(
      eq(students.courseId, courseId),
      isNull(students.deletedAt)
    ))
    .orderBy(asc(students.lastName));
}

/**
 * Search students by name
 */
export async function searchStudents(searchTerm: string) {
  const searchPattern = `%${searchTerm}%`;
  return db.select()
    .from(students)
    .where(and(
      sql`(
        ${students.firstName} ILIKE ${searchPattern} OR
        ${students.lastName} ILIKE ${searchPattern} OR
        ${students.email} ILIKE ${searchPattern} OR
        ${students.lrn} ILIKE ${searchPattern}
      )`,
      isNull(students.deletedAt)
    ))
    .orderBy(asc(students.lastName));
}

/**
 * Get student enrollment history
 */
export async function getStudentEnrollmentHistory(studentId: string) {
  return db.select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.studentId, studentId))
    .orderBy(desc(studentEnrollment.academicYear), desc(studentEnrollment.semester));
}

/**
 * Get student's current enrollment
 */
export async function getCurrentEnrollment(studentId: string, academicYear: number, semester: number) {
  return db.query.studentEnrollment.findFirst({
    where: and(
      eq(studentEnrollment.studentId, studentId),
      eq(studentEnrollment.academicYear, BigInt(academicYear)),
      eq(studentEnrollment.semester, BigInt(semester)),
      isNull(studentEnrollment.deletedAt)
    ),
  });
}

// ============================================
// ENROLLMENT & SUBJECTS QUERIES
// ============================================

/**
 * Get student's enrolled subjects for a specific enrollment
 */
export async function getEnrolledSubjects(studentId: number, enrollmentId: number) {
  return db.select({
    enrollment: subjectEnrollments,
    subject: subject,
    class: classes,
  })
    .from(subjectEnrollments)
    .leftJoin(subject, eq(subjectEnrollments.subjectId, subject.id))
    .leftJoin(classes, eq(subjectEnrollments.classId, classes.id))
    .where(and(
      eq(subjectEnrollments.studentId, studentId),
      eq(subjectEnrollments.enrollmentId, enrollmentId)
    ));
}

/**
 * Get class enrollments for a student
 */
export async function getStudentClasses(studentId: number) {
  return db.select({
    enrollment: classEnrollments,
    class: classes,
    subject: subject,
    faculty: faculty,
  })
    .from(classEnrollments)
    .leftJoin(classes, eq(classEnrollments.classId, classes.id))
    .leftJoin(subject, eq(classes.subjectId, subject.id))
    .leftJoin(faculty, eq(classes.facultyId, faculty.id))
    .where(eq(classEnrollments.studentId, sql`${studentId}::numeric`))
    .orderBy(desc(classEnrollments.createdAt));
}

/**
 * Get students enrolled in a specific class
 */
export async function getClassStudents(classId: number) {
  return db.select({
    enrollment: classEnrollments,
    student: students,
  })
    .from(classEnrollments)
    .leftJoin(students, eq(classEnrollments.studentId, sql`${students.id}::numeric`))
    .where(eq(classEnrollments.classId, BigInt(classId)));
}

/**
 * Get attendance records for a student in a class
 */
export async function getStudentAttendance(studentId: number, classId: number) {
  return db.select()
    .from(attendances)
    .where(and(
      eq(attendances.studentId, BigInt(studentId)),
      eq(attendances.classId, BigInt(classId))
    ))
    .orderBy(desc(attendances.date));
}

/**
 * Calculate attendance percentage
 */
export async function calculateAttendancePercentage(studentId: number, classId: number) {
  const records = await db.select({
    total: sql<number>`count(*)`,
    present: sql<number>`count(*) filter (where ${attendances.status} = 'present')`,
  })
    .from(attendances)
    .where(and(
      eq(attendances.studentId, BigInt(studentId)),
      eq(attendances.classId, BigInt(classId))
    ));

  const { total, present } = records[0];
  return total > 0 ? (present / total) * 100 : 0;
}

// ============================================
// COURSE & SUBJECT QUERIES
// ============================================

/**
 * Get all active courses
 */
export async function getActiveCourses() {
  return db.select()
    .from(courses)
    .where(eq(courses.isActive, true))
    .orderBy(asc(courses.title));
}

/**
 * Get course details with subjects
 */
export async function getCourseWithSubjects(courseId: number) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  if (!course) return null;

  const courseSubjects = await db.select()
    .from(subject)
    .where(eq(subject.courseId, BigInt(courseId)))
    .orderBy(asc(subject.academicYear), asc(subject.semester));

  return {
    course,
    subjects: courseSubjects,
  };
}

/**
 * Get subjects by year level and semester
 */
export async function getSubjectsByYearAndSemester(
  courseId: number,
  yearLevel: number,
  semester: number
) {
  return db.select()
    .from(subject)
    .where(and(
      eq(subject.courseId, BigInt(courseId)),
      eq(subject.academicYear, BigInt(yearLevel)),
      eq(subject.semester, BigInt(semester))
    ))
    .orderBy(asc(subject.code));
}

// ============================================
// CLASS & SCHEDULE QUERIES
// ============================================

/**
 * Get class with complete details
 */
export async function getClassDetails(classId: number) {
  const classData = await db.select({
    class: classes,
    subject: subject,
    faculty: faculty,
    room: rooms,
  })
    .from(classes)
    .leftJoin(subject, eq(classes.subjectId, subject.id))
    .leftJoin(faculty, eq(classes.facultyId, faculty.id))
    .leftJoin(rooms, eq(classes.roomId, rooms.id))
    .where(eq(classes.id, classId))
    .limit(1);

  if (classData.length === 0) return null;

  const schedules = await db.select()
    .from(schedule)
    .where(eq(schedule.classId, BigInt(classId)));

  return {
    ...classData[0],
    schedules,
  };
}

/**
 * Get faculty's classes
 */
export async function getFacultyClasses(facultyId: string) {
  return db.select({
    class: classes,
    subject: subject,
    room: rooms,
  })
    .from(classes)
    .leftJoin(subject, eq(classes.subjectId, subject.id))
    .leftJoin(rooms, eq(classes.roomId, rooms.id))
    .where(eq(classes.facultyId, facultyId))
    .orderBy(desc(classes.createdAt));
}

/**
 * Get class schedule for a specific day
 */
export async function getClassScheduleByDay(classId: number, dayOfWeek: string) {
  return db.select()
    .from(schedule)
    .where(and(
      eq(schedule.classId, BigInt(classId)),
      eq(schedule.dayOfWeek, dayOfWeek)
    ))
    .orderBy(asc(schedule.startTime));
}

// ============================================
// FINANCIAL QUERIES
// ============================================

/**
 * Get student tuition details
 */
export async function getStudentTuitionDetails(studentId: number, enrollmentId?: number) {
  const query = db.select()
    .from(studentTuition)
    .where(and(
      eq(studentTuition.studentId, BigInt(studentId)),
      isNull(studentTuition.deletedAt),
      ...(enrollmentId ? [eq(studentTuition.enrollmentId, BigInt(enrollmentId))] : [])
    ))
    .orderBy(desc(studentTuition.createdAt));

  return enrollmentId ? query.limit(1).then(r => r[0]) : query;
}

/**
 * Calculate outstanding balance
 */
export async function getOutstandingBalance(studentId: number) {
  const result = await db.select({
    totalBalance: sql<number>`sum(${studentTuition.totalBalance})`,
  })
    .from(studentTuition)
    .where(and(
      eq(studentTuition.studentId, BigInt(studentId)),
      isNull(studentTuition.deletedAt)
    ));

  return result[0]?.totalBalance || 0;
}

// ============================================
// CLEARANCE QUERIES
// ============================================

/**
 * Get student clearance status
 */
export async function getStudentClearanceStatus(
  studentId: number,
  academicYear: string,
  semester: number
) {
  return db.query.studentClearances.findFirst({
    where: and(
      eq(studentClearances.studentId, BigInt(studentId)),
      eq(studentClearances.academicYear, academicYear),
      eq(studentClearances.semester, semester)
    ),
  });
}

/**
 * Get all clearances for a student
 */
export async function getAllStudentClearances(studentId: number) {
  return db.select()
    .from(studentClearances)
    .where(eq(studentClearances.studentId, BigInt(studentId)))
    .orderBy(desc(studentClearances.academicYear), desc(studentClearances.semester));
}

// ============================================
// MEDICAL RECORDS QUERIES
// ============================================

/**
 * Get student medical records
 */
export async function getStudentMedicalRecords(studentId: number) {
  return db.select()
    .from(medicalRecords)
    .where(and(
      eq(medicalRecords.studentId, BigInt(studentId)),
      isNull(medicalRecords.deletedAt)
    ))
    .orderBy(desc(medicalRecords.visitDate));
}

/**
 * Get recent medical records
 */
export async function getRecentMedicalRecords(studentId: number, limit: number = 5) {
  return db.select()
    .from(medicalRecords)
    .where(and(
      eq(medicalRecords.studentId, BigInt(studentId)),
      isNull(medicalRecords.deletedAt)
    ))
    .orderBy(desc(medicalRecords.visitDate))
    .limit(limit);
}

// ============================================
// SHS (SENIOR HIGH SCHOOL) QUERIES
// ============================================

/**
 * Get SHS tracks with strands
 */
export async function getSHSTracksWithStrands() {
  const tracks = await db.select().from(shsTracks);

  const tracksWithStrands = await Promise.all(
    tracks.map(async (track) => {
      const strands = await db.select()
        .from(shsStrands)
        .where(eq(shsStrands.trackId, track.id));

      return {
        ...track,
        strands,
      };
    })
  );

  return tracksWithStrands;
}

/**
 * Get strand subjects
 */
export async function getStrandSubjects(strandId: number) {
  return db.select()
    .from(strandSubjects)
    .where(eq(strandSubjects.strandId, BigInt(strandId)))
    .orderBy(asc(strandSubjects.gradeYear), asc(strandSubjects.semester));
}

// ============================================
// DEPARTMENT & SCHOOL QUERIES
// ============================================

/**
 * Get schools with departments
 */
export async function getSchoolsWithDepartments() {
  const allSchools = await db.select()
    .from(schools)
    .where(eq(schools.isActive, true));

  const schoolsWithDepts = await Promise.all(
    allSchools.map(async (school) => {
      const depts = await db.select()
        .from(departments)
        .where(and(
          eq(departments.schoolId, school.id),
          eq(departments.isActive, true)
        ));

      return {
        ...school,
        departments: depts,
      };
    })
  );

  return schoolsWithDepts;
}

/**
 * Get department courses
 */
export async function getDepartmentCourses(departmentCode: string) {
  return db.select()
    .from(courses)
    .where(and(
      eq(courses.department, departmentCode),
      eq(courses.isActive, true)
    ))
    .orderBy(asc(courses.title));
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get enrollment statistics for an academic year
 */
export async function getEnrollmentStats(academicYear: number, semester: number) {
  return db.select({
    course: courses,
    totalStudents: sql<number>`count(distinct ${studentEnrollment.studentId})`,
  })
    .from(studentEnrollment)
    .leftJoin(courses, eq(sql`${studentEnrollment.courseId}::bigint`, courses.id))
    .where(and(
      eq(studentEnrollment.academicYear, BigInt(academicYear)),
      eq(studentEnrollment.semester, BigInt(semester)),
      isNull(studentEnrollment.deletedAt)
    ))
    .groupBy(courses.id);
}

/**
 * Get student count by status
 */
export async function getStudentCountByStatus() {
  return db.select({
    status: students.status,
    count: sql<number>`count(*)`,
  })
    .from(students)
    .where(isNull(students.deletedAt))
    .groupBy(students.status);
}

/**
 * Get average grades for a class
 */
export async function getClassAverageGrades(classId: number) {
  return db.select({
    avgPrelim: sql<number>`avg(${classEnrollments.prelimGrade})`,
    avgMidterm: sql<number>`avg(${classEnrollments.midtermGrade})`,
    avgFinals: sql<number>`avg(${classEnrollments.finalsGrade})`,
    avgTotal: sql<number>`avg(${classEnrollments.totalAverage})`,
  })
    .from(classEnrollments)
    .where(eq(classEnrollments.classId, BigInt(classId)));
}

// ============================================
// PENDING ENROLLMENTS
// ============================================

/**
 * Get pending enrollments
 */
export async function getPendingEnrollments() {
  return db.select()
    .from(pendingEnrollments)
    .where(eq(pendingEnrollments.status, "pending"))
    .orderBy(desc(pendingEnrollments.createdAt));
}

/**
 * Get guest enrollments by status
 */
export async function getGuestEnrollmentsByStatus(status: string) {
  return db.select()
    .from(guestEnrollments)
    .where(and(
      eq(guestEnrollments.status, status),
      isNull(guestEnrollments.deletedAt)
    ))
    .orderBy(desc(guestEnrollments.createdAt));
}

import { prisma } from "../lib/prisma";

async function testConnection() {
  try {
    console.log("Testing Prisma database connection...");

    // Test connection by querying the database
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("✓ Database connection successful!");
    console.log("Query result:", result);

    // Count students
    const studentCount = await prisma.students.count();
    console.log(`✓ Found ${studentCount} students in the database`);

    // Test a simple query
    const firstStudent = await prisma.students.findFirst({
      take: 1,
    });

    if (firstStudent) {
      console.log("✓ Successfully queried student:", {
        id: firstStudent.id,
        name: `${firstStudent.first_name} ${firstStudent.last_name}`,
        email: firstStudent.email,
      });
    } else {
      console.log("ℹ No students found in database");
    }

    console.log("\n✓ All tests passed! Prisma is configured correctly.");
  } catch (error) {
    console.error("✗ Database connection failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

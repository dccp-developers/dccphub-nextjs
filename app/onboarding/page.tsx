"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import { AlertCircle, CheckCircle2, GraduationCap, Users } from "lucide-react";
import { isValidPhoneNumber } from "react-phone-number-input";

interface StudentData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  studentId: number;
  birthDate: string;
  address: string;
  courseId: number;
  gender: string;
  age: number;
  academicYear: number;
  status: string;
  contacts: string;
}

interface FacultyData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  facultyId: string;
  facultyCode: string;
  department: string;
  phoneNumber: string;
  status: string;
}

type UserRole = "student" | "faculty" | null;

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<"role" | "validate" | "complete">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Validation step data
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState(""); // Student ID or Faculty Code

  // Validated user data
  const [validatedStudent, setValidatedStudent] = useState<StudentData | null>(
    null,
  );
  const [validatedFaculty, setValidatedFaculty] = useState<FacultyData | null>(
    null,
  );

  // Additional required fields
  const [phone, setPhone] = useState("");

  // Check if user already has a role and redirect accordingly
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role as UserRole;

      console.log("[ONBOARDING] User metadata:", {
        role: userRole,
        metadata: user.publicMetadata,
      });

      // If user has a role and completed onboarding, redirect to appropriate dashboard
      if (userRole === "student") {
        const hasRequiredInfo =
          user.publicMetadata?.studentId &&
          user.publicMetadata?.dateOfBirth &&
          user.publicMetadata?.phone;

        if (hasRequiredInfo) {
          console.log("[ONBOARDING] Student already completed onboarding");
          window.location.href = "/dashboard/student";
          return;
        }

        // If role exists but missing info, skip role selection
        setSelectedRole("student");
        setStep("validate");
      } else if (userRole === "faculty") {
        const hasRequiredInfo =
          user.publicMetadata?.facultyId && user.publicMetadata?.phone;

        if (hasRequiredInfo) {
          console.log("[ONBOARDING] Faculty already completed onboarding");
          window.location.href = "/dashboard/faculty";
          return;
        }

        setSelectedRole("faculty");
        setStep("validate");
      }

      // Pre-fill email if available from Clerk
      if (user.emailAddresses && user.emailAddresses.length > 0) {
        setEmail(user.emailAddresses[0].emailAddress);
      }
    }
  }, [isLoaded, user]);

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setStep("validate");
    setMessage(null);
  };

  const handleValidateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const endpoint =
        selectedRole === "student"
          ? "/api/students/validate"
          : "/api/faculty/validate";

      const body =
        selectedRole === "student"
          ? { email, studentId: identifier }
          : { email, facultyCode: identifier };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.valid) {
        if (selectedRole === "student") {
          setValidatedStudent(data.student);
          if (data.student.contacts) {
            setPhone(data.student.contacts);
          }
          setMessage({
            type: "success",
            text: `Welcome, ${data.student.firstName} ${data.student.lastName}! Your student record has been verified.`,
          });
        } else {
          setValidatedFaculty(data.faculty);
          if (data.faculty.phoneNumber) {
            setPhone(data.faculty.phoneNumber);
          }
          setMessage({
            type: "success",
            text: `Welcome, ${data.faculty.firstName} ${data.faculty.lastName}! Your faculty record has been verified.`,
          });
        }
        setStep("complete");
      } else {
        setMessage({
          type: "error",
          text:
            data.error || "Validation failed. Please check your credentials.",
        });
      }
    } catch (error) {
      console.error("Error validating user:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again or contact the School MIS Administration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validatedStudent && !validatedFaculty) {
      setMessage({ type: "error", text: "User validation required." });
      return;
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      setMessage({
        type: "error",
        text: "Please enter a valid phone number with country code.",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("[ONBOARDING] Starting metadata update...");

      const endpoint =
        selectedRole === "student"
          ? "/api/students/update-metadata"
          : "/api/faculty/update-metadata";

      const metadata =
        selectedRole === "student" && validatedStudent
          ? {
              role: "student",
              studentId: validatedStudent.studentId.toString(),
              dateOfBirth: validatedStudent.birthDate,
              phone: phone,
              email: validatedStudent.email,
              firstName: validatedStudent.firstName,
              lastName: validatedStudent.lastName,
              middleName: validatedStudent.middleName,
              address: validatedStudent.address,
              courseId: validatedStudent.courseId,
              gender: validatedStudent.gender,
              age: validatedStudent.age,
              academicYear: validatedStudent.academicYear,
              status: validatedStudent.status,
              verifiedAt: new Date().toISOString(),
            }
          : validatedFaculty && {
              role: "faculty",
              facultyId: validatedFaculty.facultyId,
              facultyCode: validatedFaculty.facultyCode,
              phone: phone,
              email: validatedFaculty.email,
              firstName: validatedFaculty.firstName,
              lastName: validatedFaculty.lastName,
              middleName: validatedFaculty.middleName,
              department: validatedFaculty.department,
              status: validatedFaculty.status,
              verifiedAt: new Date().toISOString(),
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata }),
      });

      console.log("[ONBOARDING] Response status:", response.status);
      const data = await response.json();
      console.log("[ONBOARDING] Response data:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || data.details || "Failed to update profile",
        );
      }

      setMessage({
        type: "success",
        text: "Profile completed successfully! Redirecting to dashboard...",
      });

      console.log("[ONBOARDING] Metadata updated, redirecting...");
      setTimeout(() => {
        const dashboardPath =
          selectedRole === "student"
            ? "/dashboard/student"
            : "/dashboard/faculty";
        console.log("[ONBOARDING] Redirecting to", dashboardPath);
        window.location.href = dashboardPath;
      }, 1500);
    } catch (error) {
      console.error("[ONBOARDING] Error completing onboarding:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to complete profile setup. Please try again.",
      });
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800">
            {step === "role" && "Welcome! Select Your Role"}
            {step === "validate" &&
              `Verify Your ${selectedRole === "student" ? "Student" : "Faculty"} Account`}
            {step === "complete" && "Complete Your Profile"}
          </CardTitle>
          <CardDescription className="text-base">
            {step === "role" &&
              "Please select your role to continue with the onboarding process."}
            {step === "validate" &&
              `Please enter your ${selectedRole === "student" ? "Student ID" : "Faculty Code"} and email to verify your account.`}
            {step === "complete" &&
              "Just one more step! Add your contact information to access the dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "role" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelection("student")}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <GraduationCap className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Student
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      I am a student enrolled in the institution
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("faculty")}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Users className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Faculty
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      I am a faculty member or instructor
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === "validate" && (
            <form onSubmit={handleValidateUser} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === "student"
                        ? "student@university.edu"
                        : "faculty@university.edu"
                    }
                    required
                    disabled={isLoading}
                    className="text-base"
                  />
                  <p className="text-xs text-gray-500">
                    Use the email registered with the school
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identifier">
                    {selectedRole === "student" ? "Student ID" : "Faculty Code"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === "student"
                        ? "e.g., 202400123"
                        : "e.g., FAC-2024-001"
                    }
                    required
                    disabled={isLoading}
                    className="text-base"
                  />
                  <p className="text-xs text-gray-500">
                    Enter your{" "}
                    {selectedRole === "student"
                      ? "numeric student ID"
                      : "faculty code"}
                  </p>
                </div>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg text-sm flex items-start gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{message.text}</p>
                    {message.type === "error" && (
                      <p className="mt-2 text-xs">
                        If you continue to experience issues, please contact the
                        School MIS Administration for assistance with your
                        account verification.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("role");
                    setSelectedRole(null);
                    setIdentifier("");
                    setMessage(null);
                  }}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 text-base py-6"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify Account"
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === "complete" && (
            <form onSubmit={handleCompleteOnboarding} className="space-y-6">
              {/* Display validated user info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-800 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Account Verified</span>
                </div>
                <div className="text-sm text-green-700 space-y-1 ml-7">
                  {selectedRole === "student" && validatedStudent && (
                    <>
                      <p>
                        <strong>Name:</strong> {validatedStudent.firstName}{" "}
                        {validatedStudent.middleName}{" "}
                        {validatedStudent.lastName}
                      </p>
                      <p>
                        <strong>Student ID:</strong>{" "}
                        {validatedStudent.studentId}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {validatedStudent.status || "Active"}
                      </p>
                      {validatedStudent.academicYear && (
                        <p>
                          <strong>Academic Year:</strong>{" "}
                          {validatedStudent.academicYear}
                        </p>
                      )}
                    </>
                  )}
                  {selectedRole === "faculty" && validatedFaculty && (
                    <>
                      <p>
                        <strong>Name:</strong> {validatedFaculty.firstName}{" "}
                        {validatedFaculty.middleName}{" "}
                        {validatedFaculty.lastName}
                      </p>
                      <p>
                        <strong>Faculty Code:</strong>{" "}
                        {validatedFaculty.facultyCode}
                      </p>
                      <p>
                        <strong>Department:</strong>{" "}
                        {validatedFaculty.department || "N/A"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {validatedFaculty.status || "Active"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Phone number field */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <PhoneInput
                  id="phone"
                  value={phone}
                  onChange={(value) => setPhone(value || "")}
                  placeholder="Enter phone number"
                  required
                  disabled={isLoading}
                  className="text-base"
                />
                <p className="text-xs text-gray-500">
                  Select your country code and enter your contact number
                  (defaults to Philippines +63)
                </p>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg text-sm flex items-start gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("validate");
                    setValidatedStudent(null);
                    setValidatedFaculty(null);
                    setMessage(null);
                  }}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 text-base py-6"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Completing...
                    </span>
                  ) : (
                    "Complete Profile & Continue"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

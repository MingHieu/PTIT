-- Step 1: Create a classroom and retrieve its ID
WITH new_classroom AS (
    INSERT INTO "Classroom" ("id", "ownerId", "name", "description", "status", "isPrivate", "createdAt", "updatedAt")
    VALUES 
        (gen_random_uuid(), 2, 'Advanced Classroom', 'This classroom is for testing.', 'ACTIVE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING "id"
),

-- Step 2: Create 3 exams associated with the classroom
exam_data AS (
    INSERT INTO "Exam" ("classroomId", "title", "description", "dueDate", "duration", "isGraded", "type", "createdAt", "updatedAt")
    SELECT 
        (SELECT "id" FROM new_classroom), 
        "title", 
        'Description for ' || "title", 
        EXTRACT(EPOCH FROM (NOW() + INTERVAL '1 day' * ROW_NUMBER() OVER ())) * 1000, 
        90, 
        true, 
        'ESSAY', 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
    FROM (VALUES 
        ('15 phút'), 
        ('1 tiết'), 
        ('giữa kì')
    ) AS exam_titles("title")
    RETURNING "id"
),

-- Step 3: Create 60 users with different emails
user_data AS (
    INSERT INTO "User" ("email", "password", "name", "avatarUrl", "isVerify", "createdAt", "updatedAt")
    SELECT 
        'user' || i || '@example.com', 
        'hashed_password', 
        'User ' || i, 
        NULL, 
        true, 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
    FROM generate_series(1, 60) i
    RETURNING "id"
),

-- Step 4: Create 60 students from the 60 users in the classroom
student_data AS (
    INSERT INTO "Student" ("userId", "classroomId", "name", "createdAt", "updatedAt")
    SELECT 
        "id",
        (SELECT "id" FROM new_classroom), 
        'Student ' || ROW_NUMBER() OVER (), 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
    FROM user_data
    RETURNING "id"
),

-- Step 5: Create 180 submissions (60 students × 3 exams with random grades)
submission_data AS (
    INSERT INTO "Submission" ("studentId", "examId", "grade", "createdAt", "updatedAt")
    SELECT 
        s.id, 
        e.id, 
        random() * 10, -- Random grade between 0 and 10
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
    FROM student_data s
    CROSS JOIN exam_data e -- Combine all students with all exams
    RETURNING "id"
)

-- Step 6: Create 180 files for the submissions
INSERT INTO "File" ("name", "type", "url", "key", "submissionId", "createdAt")
SELECT 
    'File ' || ROW_NUMBER() OVER (), 
    'application/pdf', 
    'https://example.com/file' || ROW_NUMBER() OVER (), 
    'file_key_' || ROW_NUMBER() OVER (), 
    "id", 
    CURRENT_TIMESTAMP
FROM submission_data;

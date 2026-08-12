# Software Requirements Specification (SRS)

## Student Performance Ranking System

## 1. Introduction

### 1.1 Project Title

**Student Performance Ranking System Using AVL Tree**

### 1.2 Purpose

The purpose of the Student Performance Ranking System is to help educational institutions efficiently manage, analyze, search, and rank students based on their academic performance.

The system stores student performance records and automatically maintains students in an organized structure according to their calculated performance score.

The main data structure used in the application is an **AVL Tree**, which provides efficient insertion, searching, deletion, and ranking operations while automatically maintaining a balanced tree structure.

---

# 2. Problem Statement

Educational institutions manage large numbers of student records containing information such as:

* Student ID
* Student name
* Module marks
* Assignment marks
* Examination marks
* Attendance
* GPA
* Overall performance score

When the number of students increases, manually identifying:

* Top-performing students
* Lowest-performing students
* Student rankings
* Students at academic risk
* Individual student performance

becomes difficult and time-consuming.

Traditional systems may store records in simple lists or arrays. When large numbers of records are involved, repeatedly searching, sorting, inserting, and deleting records may become inefficient.

Therefore, the proposed system will use an **AVL Tree** to organize students according to their performance score and provide efficient student ranking and searching.

---

# 3. Proposed Solution

The proposed Student Performance Ranking System will allow authorized users such as lecturers or administrators to enter student academic information.

The system will calculate each student's overall performance score and place the student into an AVL Tree according to that score.

For example:

```text
Student       Performance Score
--------------------------------
Nimal               65
Kamal               82
Sunil               74
Amal                91
Kasun               58
```

The AVL Tree may internally appear as:

```text
                74
              /    \
            65      82
           /          \
         58            91
```

The AVL Tree automatically balances itself when student records are inserted or removed.

The system can then generate rankings such as:

```text
Rank  Student     Score
-----------------------
1     Amal          91
2     Kamal         82
3     Sunil         74
4     Nimal         65
5     Kasun         58
```

---

# 4. Objectives

The main objectives of the system are to:

1. Store student academic performance records efficiently.
2. Calculate student performance scores automatically.
3. Rank students according to their academic performance.
4. Search students quickly.
5. Identify high-performing students.
6. Identify students who may be academically at risk.
7. Automatically maintain a balanced data structure.
8. Provide lecturers with useful student performance information.

---

# 5. Users of the System

The main users of the system are:

### Administrator

The administrator can:

* Add students
* Update student records
* Delete students
* View student rankings
* Search students
* View performance reports

### Lecturer

A lecturer can:

* Enter marks
* View students
* Search students
* View rankings
* View student performance
* Identify students requiring additional support

---

# 6. Input Requirements

The system should accept the following student information.

### Student Details

* Student ID
* Student Name
* Course
* Semester
* Module
* Assignment Marks
* Examination Marks
* Attendance Percentage

Example:

```text
Student ID: ST001
Name: Amal Perera
Assignment Marks: 80
Exam Marks: 85
Attendance: 90%
```

---

# 7. Processing

The system processes the entered information to calculate the student's overall performance.

A possible formula is:

```text
Performance Score =
Assignment Marks × 30%
+
Exam Marks × 60%
+
Attendance × 10%
```

Example:

```text
Assignment = 80
Exam = 85
Attendance = 90

Performance Score =
80 × 0.30
+ 85 × 0.60
+ 90 × 0.10

= 24 + 51 + 9

= 84
```

Therefore:

```text
Student: Amal Perera
Performance Score: 84
```

The student is then inserted into the AVL Tree according to the performance score.

---

# 8. Output Requirements

The system should provide outputs including:

* Student details
* Student performance score
* Student rank
* Complete ranking list
* Highest-performing student
* Lowest-performing student
* At-risk students
* Average student performance
* Search results
* Performance category

Example:

```text
Student: Amal Perera
Student ID: ST001
Score: 84
Rank: 2
Category: Excellent
Status: Good Standing
```

---

# 9. Main Data Structure

## AVL Tree

The main data structure selected for the project is an:

**AVL Tree**

An AVL Tree is a self-balancing Binary Search Tree.

Each node stores information about a student.

Example node:

```text
StudentNode
|
|-- Student ID
|-- Student Name
|-- Marks
|-- Attendance
|-- Performance Score
|-- Height
|-- Left Child
|-- Right Child
```

The main ordering value will be:

```text
Performance Score
```

If two students have the same performance score, the Student ID can be used as a secondary key.

For example:

```text
Score 85 - ST001
Score 85 - ST015
```

This prevents duplicate-key problems.

---

# 10. Why AVL Tree Is the Best Data Structure

Several available data structures could be used, including:

* Doubly Linked List
* Circular Linked List
* Binary Search Tree
* Heap
* Red-Black Tree
* Graph
* AVL Tree

However, **AVL Tree is particularly suitable for this application**.

## AVL Tree Search

Searching takes approximately:

```text
O(log n)
```

## AVL Tree Insertion

Insertion takes:

```text
O(log n)
```

## AVL Tree Deletion

Deletion takes:

```text
O(log n)
```

because the AVL Tree automatically keeps itself balanced.

---

# 11. Why Not Use an Ordinary Binary Search Tree?

A normal Binary Search Tree could become unbalanced.

For example, if the following scores are inserted:

```text
50
60
70
80
90
```

a normal BST may become:

```text
50
  \
   60
     \
      70
        \
         80
           \
            90
```

The tree effectively becomes similar to a linked list.

Searching can then reach:

```text
O(n)
```

An AVL Tree automatically balances this tree.

For example:

```text
          70
        /    \
      60      80
     /          \
   50            90
```

Therefore searching remains approximately:

```text
O(log n)
```

---

# 12. Why Not Use a Heap?

A Heap is excellent when the main requirement is repeatedly retrieving only the highest or lowest value.

For example:

```text
Highest Performing Student
```

could be retrieved efficiently using a Max Heap.

However, our system also requires:

* Searching for particular students
* Removing students
* Updating students
* Displaying complete sorted rankings
* Finding students within performance ranges

A Heap is less suitable for these operations.

An AVL Tree provides better overall functionality for a complete ranking system.

---

# 13. Why Not Use a Linked List?

A Doubly Linked List could store students, but searching for a particular performance score may require:

```text
O(n)
```

For 10,000 students, the system could potentially check thousands of records.

AVL Tree provides approximately:

```text
O(log n)
```

searching.

Therefore AVL is more efficient.

---

# 14. Algorithms Used

The system will implement several algorithms.

## 14.1 AVL Tree Insertion Algorithm

Used when adding a new student.

Process:

```text
Enter student details
        ↓
Calculate performance score
        ↓
Create AVL node
        ↓
Compare score with existing nodes
        ↓
Insert student
        ↓
Calculate balance factor
        ↓
Perform rotation if required
```

---

# 15. Balance Factor Algorithm

The system calculates:

```text
Balance Factor =
Height of Left Subtree
-
Height of Right Subtree
```

Valid AVL balance values are:

```text
-1
0
+1
```

If the balance becomes greater than +1 or less than -1, the tree must be rebalanced.

---

# 16. AVL Rotation Algorithms

Four rotations may be required.

## 16.1 Right Rotation

Used for a Left-Left imbalance.

Example:

```text
        80
       /
      70
     /
    60
```

After rotation:

```text
        70
       /  \
      60   80
```

---

## 16.2 Left Rotation

Used for a Right-Right imbalance.

```text
60
  \
   70
     \
      80
```

Becomes:

```text
      70
     /  \
    60   80
```

---

## 16.3 Left-Right Rotation

Used when a node is inserted into the right subtree of the left child.

---

## 16.4 Right-Left Rotation

Used when a node is inserted into the left subtree of the right child.

These algorithms guarantee that the tree remains balanced.

---

# 17. Search Algorithm

The AVL Tree search algorithm can locate students according to their performance score.

Example:

```text
Search Score: 82
```

Process:

```text
               74
                 \
                  82
```

Because:

```text
82 > 74
```

the algorithm searches the right subtree.

Complexity:

```text
O(log n)
```

For searching directly by Student ID, the system can maintain a secondary lookup structure or traverse matching score nodes where necessary.

For the academic project, the primary AVL ordering will remain performance score because ranking is the main system objective.

---

# 18. Student Ranking Algorithm

To display students from lowest score to highest score, the system can use:

**In-Order Traversal**

Traversal order:

```text
Left → Root → Right
```

Result:

```text
58
65
74
82
91
```

---

# 19. Reverse Ranking Algorithm

To display students from highest-performing to lowest-performing student, use:

**Reverse In-Order Traversal**

Traversal:

```text
Right → Root → Left
```

Result:

```text
91
82
74
65
58
```

The output can then be assigned ranks:

```text
1 - 91
2 - 82
3 - 74
4 - 65
5 - 58
```

This algorithm is an important part of the project because it directly demonstrates how the tree structure is used for student rankings.

---

# 20. Delete Algorithm

When a student leaves the institution, the student can be removed.

Process:

```text
Find Student
      ↓
Delete AVL Node
      ↓
Recalculate Heights
      ↓
Check Balance Factors
      ↓
Perform Rotations
```

Complexity:

```text
O(log n)
```

---

# 21. Update Algorithm

If student marks change:

```text
Old Score = 65
New Score = 82
```

the AVL Tree position may also need to change.

Therefore:

```text
Find Student
      ↓
Delete Existing Node
      ↓
Calculate New Score
      ↓
Insert Updated Student
      ↓
Rebalance AVL Tree
```

---

# 22. Performance Classification Algorithm

The system can automatically classify students.

Example:

```text
85 – 100 → Excellent
75 – 84  → Very Good
65 – 74  → Good
50 – 64  → Satisfactory
Below 50 → At Risk
```

Example output:

```text
Name: Kasun Silva
Performance: 45
Category: At Risk
```

---

# 23. Functional Requirements

## FR01 – Add Student

The system shall allow authorized users to add student records.

## FR02 – Calculate Performance

The system shall automatically calculate a student's overall performance score.

## FR03 – Insert Student into AVL Tree

The system shall insert each student into the AVL Tree according to the calculated performance score.

## FR04 – Search Student

The system shall allow users to search for student performance information.

## FR05 – Update Student

The system shall allow student marks and academic information to be updated.

## FR06 – Delete Student

The system shall allow authorized users to remove student records.

## FR07 – Generate Ranking

The system shall generate student rankings from highest to lowest performance score.

## FR08 – Display Top Performers

The system shall identify top-performing students.

Example:

```text
Top 3 Students
```

## FR09 – Identify At-Risk Students

The system shall identify students whose performance is below the predefined threshold.

## FR10 – Display Tree

The system may visually display the AVL Tree structure for demonstration purposes.

This is especially useful for demonstrating the data structure during the viva.

---

# 20. Non-Functional Requirements

## Performance

The application should perform insertion, deletion, and searching efficiently.

## Usability

The interface should be easy for lecturers and administrators to understand.

## Reliability

Student scores and rankings should be calculated correctly.

## Maintainability

The application should use separate classes for:

```text
Student
AVLNode
AVLTree
PerformanceCalculator
RankingService
User Interface
```

## Security

Only authorized users should be allowed to modify student academic records.

---

# 25. Proposed Novel Features

The assignment requires approximately 2–3 innovative features.

The following three features can distinguish the proposed system from a basic ranking system.

## Novel Feature 1 – Performance Trend Score

Instead of ranking students only using current marks, the system can identify whether a student is improving or declining.

Example:

```text
Semester 1 = 55
Semester 2 = 63
Semester 3 = 72
```

Output:

```text
Performance Trend: Improving
Improvement: +17 points
```

Another student:

```text
Semester 1 = 80
Semester 2 = 70
Semester 3 = 61

Performance Trend: Declining
```

This provides more useful information than simple ranking.

---

# 26. Novel Feature 2 – Academic Risk Detection

The application can automatically identify students who may require academic support.

Example rules:

```text
Performance Score < 50

OR

Attendance < 70%

OR

Performance decreased by more than 15%
```

Output:

```text
Student: ST020
Score: 46
Attendance: 62%

Risk Level: HIGH

Reason:
Low academic performance
Low attendance
```

This makes the system useful for early intervention rather than simply ranking students.

---

# 27. Novel Feature 3 – Improvement-Based Recognition

Traditional ranking systems normally recognize only students with the highest marks.

The proposed system can also recognize students who have made significant improvements.

Example:

```text
Student A

Previous Score: 45
Current Score: 72

Improvement: +27
```

The system may generate:

```text
Most Improved Student
Student A
+27 Points
```

Therefore students can receive recognition even if they are not ranked first academically.

---

# 28. Major System Modules

The application can contain the following modules:

### 1. Student Management

```text
Add Student
Update Student
Delete Student
View Student
```

### 2. Performance Management

```text
Enter Marks
Calculate Score
Calculate Grade
Calculate Performance Category
```

### 3. AVL Tree Management

```text
Insert Node
Delete Node
Search Node
Calculate Height
Calculate Balance
Perform Rotations
```

### 4. Ranking Management

```text
Generate Ranking
Top Performers
Lowest Performers
Most Improved
```

### 5. Academic Risk Analysis

```text
Check marks
Check attendance
Check performance trend
Generate risk status
```

### 6. Reporting

```text
Student Performance Report
Ranking Report
At-Risk Student Report
Top Performer Report
```

---

# 29. Proposed Classes

A possible object-oriented structure is:

```text
Student
|
|-- studentId
|-- name
|-- assignmentMark
|-- examMark
|-- attendance
|-- performanceScore
|-- previousScore
```

```text
AVLNode
|
|-- Student student
|-- AVLNode left
|-- AVLNode right
|-- int height
```

```text
AVLTree
|
|-- insert()
|-- delete()
|-- search()
|-- getHeight()
|-- getBalance()
|-- rotateLeft()
|-- rotateRight()
|-- inOrder()
|-- reverseInOrder()
```

```text
PerformanceCalculator
|
|-- calculatePerformance()
|-- calculateTrend()
|-- classifyPerformance()
|-- calculateRisk()
```

---

# 30. Main Algorithms Used

| Algorithm                  | Purpose                    |          Complexity |
| -------------------------- | -------------------------- | ------------------: |
| AVL Insertion              | Add student                |            O(log n) |
| AVL Search                 | Find student/performance   |            O(log n) |
| AVL Deletion               | Delete student             |            O(log n) |
| Left Rotation              | Balance AVL Tree           |                O(1) |
| Right Rotation             | Balance AVL Tree           |                O(1) |
| In-Order Traversal         | Ascending ranking          |                O(n) |
| Reverse In-Order Traversal | Highest-to-lowest ranking  |                O(n) |
| Performance Calculation    | Calculate student score    |                O(1) |
| Risk Detection             | Analyze individual student |                O(1) |
| Trend Calculation          | Measure improvement        | O(1) per comparison |

---

# 31. Input–Process–Output Model

## Input

```text
Student ID
Student Name
Assignment Marks
Exam Marks
Attendance
Previous Performance
```

↓

## Process

```text
Validate Data
        ↓
Calculate Performance
        ↓
Calculate Risk
        ↓
Insert into AVL Tree
        ↓
Balance AVL Tree
        ↓
Traverse AVL Tree
        ↓
Generate Ranking
```

↓

## Output

```text
Student Performance Score
Student Rank
Performance Category
Top Performers
At-Risk Students
Improvement Status
Complete Ranking
```

---

# 32. Testing Requirements

The system should be tested using several test cases.

### Test Case 1 – Add Student

Input:

```text
Student ID: ST001
Assignment: 80
Exam: 85
Attendance: 90
```

Expected:

```text
Student successfully inserted.
Performance Score = 84
```

### Test Case 2 – AVL Rotation

Insert:

```text
Score 90
Score 80
Score 70
```

The tree initially forms a Left-Left imbalance.

Expected:

```text
Right Rotation
```

Result:

```text
       80
      /  \
     70   90
```

### Test Case 3 – Ranking

Input scores:

```text
65, 91, 72, 85
```

Expected ranking:

```text
1. 91
2. 85
3. 72
4. 65
```

### Test Case 4 – Risk Identification

Input:

```text
Score: 42
Attendance: 61%
```

Expected:

```text
Risk Level: High
```

---

# 33. Literature Review Direction

For the mini research section, existing systems can be investigated in areas such as:

* Learning Management Systems
* Student Information Systems
* Student Grade Management Systems
* Academic Analytics Systems
* Student Ranking Systems
* Early Warning Systems for academic performance

The literature review should identify what existing systems already provide, such as:

```text
Grade calculation
Student reports
Attendance monitoring
Basic ranking
```

Then identify limitations.

For example:

```text
Existing System
     ↓
Displays marks and GPA
     ↓
But may not emphasize:
- Improvement-based ranking
- Early risk detection
- Dynamic performance trends
```

The proposed system addresses these limitations through its novel features.

---

# 34. Comparison With Existing Systems

| Feature                         | Typical Student System        | Proposed System |
| ------------------------------- | ----------------------------- | --------------- |
| Store Marks                     | Yes                           | Yes             |
| Calculate Grades                | Yes                           | Yes             |
| Student Ranking                 | Sometimes                     | Yes             |
| Efficient AVL Ranking Structure | Usually hidden/database-based | Yes             |
| Performance Trend               | Limited                       | Yes             |
| Academic Risk Detection         | Limited                       | Yes             |
| Most Improved Student           | Rare                          | Yes             |
| AVL Tree Visualization          | No                            | Yes             |

---

# 35. Recommended Technology

The project can be implemented using:

```text
Programming Language:
Java
```

Possible interface:

```text
Java Swing
or
JavaFX
```

For a simpler version:

```text
Console Application
```

For this Data Structures assignment, it is better to implement the **AVL Tree manually** rather than using a built-in Java TreeMap or another collection that hides the data structure implementation.

---

# 36. Important Viva Explanation

A strong explanation for the data structure selection would be:

> We selected an AVL Tree because the Student Performance Ranking System requires frequent insertion, deletion, searching, and ordered retrieval of student performance records. A normal Binary Search Tree can become unbalanced and degrade to O(n) search time. An AVL Tree automatically balances itself using rotations and maintains approximately O(log n) insertion, search, and deletion. Reverse in-order traversal also allows us to generate student rankings efficiently from highest to lowest performance.

---

# 37. Core Project Flow

```text
               START
                 |
                 v
        Enter Student Details
                 |
                 v
        Validate Student Data
                 |
                 v
      Calculate Performance Score
                 |
                 v
        Create Student AVL Node
                 |
                 v
         Insert into AVL Tree
                 |
                 v
       Calculate Balance Factor
                 |
          +------+------+
          |             |
       Balanced?       No
          |             |
         Yes       Perform Rotation
          |             |
          +------+------+
                 |
                 v
        Generate Student Ranking
                 |
                 v
      Analyze Performance Trend
                 |
                 v
        Detect At-Risk Students
                 |
                 v
           Display Results
```

---

# 38. Final Data Structure and Algorithms

## Primary Data Structure

**AVL Tree**

## Main Algorithms

1. AVL Tree insertion
2. AVL Tree deletion
3. AVL Tree searching
4. Height calculation
5. Balance factor calculation
6. Left rotation
7. Right rotation
8. Left-Right rotation
9. Right-Left rotation
10. In-order traversal
11. Reverse in-order traversal
12. Performance-score calculation
13. Performance-trend calculation
14. Academic-risk detection
15. Student-ranking algorithm

The combination of an **AVL Tree + ranking traversal + performance analysis algorithms** provides a strong relationship between the selected data structure and the real-world problem, making the project suitable for both implementation and viva demonstration.

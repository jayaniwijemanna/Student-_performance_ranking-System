# Student Performance Ranking System Using AVL Tree

---

## Table of Contents

1. Introduction
2. Problem Statement
3. Literature Review
4. Proposed Solution
5. System Functionalities
6. Selected Data Structure and Justification
7. Novel Features
8. Technologies Used
9. Selling Points of the Application
10. Individual Reflection
11. Conclusion
12. References

---

## List of Figures

- Figure 1: AVL Tree Self-Balancing Visualization
- Figure 2: System Architecture Diagram
- Figure 3: Live AVL Tree Data Structure Graph (Frontend)
- Figure 4: Student Performance Leaderboard Rankings
- Figure 5: At-Risk Student Identification Dashboard

## List of Tables

- Table 1: Literature Review Comparison of Existing Systems
- Table 2: Data Structure Complexity Comparison
- Table 3: Performance Category Classification Thresholds
- Table 4: Novel Features Summary

---

## 1. Introduction

Educational institutions face increasing challenges in efficiently managing, analyzing, and ranking student academic performance across multiple modules and batches. As the number of students grows, the need for a scalable, real-time performance evaluation system becomes critical.

This report presents the development of **Scholastic Insight** — a Student Performance Ranking System that leverages the **AVL Tree (Adelson-Velsky and Landis Tree)** data structure to provide efficient, self-balancing student performance ranking. The system calculates weighted performance scores using the formula: *Performance Score = (Assignment × 30%) + (Exam × 60%) + (Attendance × 10%)*, inserts students into a self-balancing AVL Tree ordered by score, and enables real-time leaderboard generation, score-based search, and at-risk student identification — all with guaranteed O(log n) time complexity.

---

## 2. Problem Statement

Educational institutions manage large volumes of student records containing assignment marks, exam scores, attendance percentages, and module enrollments. When the number of students increases, manually identifying top-performing students, lowest-performing students, and students at academic risk becomes difficult and time-consuming.

Traditional systems store records in simple arrays or databases and rely on O(n log n) sorting algorithms to generate rankings each time they are needed. This approach becomes increasingly inefficient as datasets grow. Furthermore, existing systems lack real-time visual data structure representation, making it difficult for educators to understand the underlying organization of student performance data.

The core problem is the absence of a system that can:
- Insert and update student evaluations efficiently in O(log n) time.
- Generate sorted leaderboard rankings without repeated sorting operations.
- Visually demonstrate the self-balancing data structure properties (Height, Balance Factor, Rotations).
- Automatically identify at-risk students based on configurable thresholds.

---

## 3. Literature Review

A review of existing student performance management tools was conducted to identify gaps and opportunities for innovation.

**Table 1: Literature Review – Existing Systems Comparison**

| System | Strengths | Limitations |
|--------|-----------|-------------|
| **Moodle LMS** (Dougiamas, 2024) | Widely adopted; grade tracking; plugin ecosystem | No real-time ranking; no data structure visualization; relies on SQL sorting |
| **Google Classroom** (Google, 2024) | Simple interface; assignment management; cloud-based | No performance scoring formula; no leaderboard; no at-risk detection |
| **Canvas LMS** (Instructure, 2024) | Analytics dashboard; grade weighting | No self-balancing data structure; batch operations are slow on large datasets |
| **Power BI Education Dashboards** (Microsoft, 2024) | Advanced analytics; visualization | Requires manual data import; no built-in AVL or BST processing; expensive licensing |
| **Custom BST-based systems** (Academic research) | Demonstrates BST operations | Susceptible to O(n) degeneration with sorted input; no automatic balancing |

**Key Findings**: None of the reviewed systems implement a self-balancing tree data structure for real-time student ranking. All rely on database-level sorting (O(n log n)) rather than maintaining an in-memory balanced structure. Furthermore, no system provides a live visual representation of the underlying data structure.

---

## 4. Proposed Solution

The proposed system, **Scholastic Insight**, addresses the identified gaps by implementing an AVL Tree as the core data structure for student performance ranking. The system follows a three-tier architecture:

- **Frontend**: React.js with Vite — responsive web dashboard with live AVL Tree visualizer.
- **Backend**: Spring Boot (Java) — RESTful API with AVL Tree operations implemented as a custom data structure class.
- **Database**: MongoDB — persistent storage for student records, batches, and modules.

**System Workflow**:
1. Lecturer enters student marks (Assignment, Exam, Attendance) via the web interface.
2. Backend calculates the weighted performance score using the formula.
3. A new AVLNode is created and inserted into the AVL Tree with automatic self-balancing (LL, RR, LR, RL rotations).
4. The tree is serialized to JSON and rendered as an interactive visual graph on the frontend.
5. Rankings are generated via Reverse In-Order Traversal (Right → Root → Left) in O(n) time.

---

## 5. System Functionalities

The system provides the following core functionalities:

1. **User Authentication & Role-Based Access**: Admin, Lecturer, and Student roles with secure BCrypt password hashing.
2. **Batch & Module Management**: Admin can create batches (e.g., DS-2024-B1) and assign modules with credits.
3. **Student Performance Evaluation**: Lecturers enter assignment marks, exam scores, and attendance for each student per module.
4. **AVL Tree Insertion with Auto-Balancing**: Each evaluation record is inserted as an AVLNode. The tree automatically performs LL, RR, LR, or RL rotations to maintain |BF| ≤ 1.
5. **Leaderboard Rankings**: Reverse In-Order Traversal generates a sorted leaderboard (Rank #1 = Highest Score).
6. **Score-Based Binary Search**: Users can search for students by performance score in O(log n) time.
7. **At-Risk Student Identification**: Students with Score < 50 or Attendance < 70% are automatically flagged.
8. **Live AVL Tree Visualization**: Interactive visual graph showing each node's Height, Balance Factor, and Left/Right subtree connections with zoom controls.
9. **Student Dashboard**: Students can view their own performance across enrolled modules with risk/standing indicators.
10. **Evaluation Record Deletion**: Removes a node from the AVL Tree and rebalances via the deletion algorithm.

---

## 6. Selected Data Structure and Justification

The **AVL Tree** was selected as the primary data structure for this application.

**Table 2: Data Structure Complexity Comparison**

| Data Structure | Search | Insertion | Deletion | Sorted Traversal | Worst-Case Risk |
|---------------|--------|-----------|----------|-----------------|-----------------|
| Unsorted Array | O(n) | O(1) | O(n) | O(n log n) | Slow lookup |
| Sorted Array | O(log n) | O(n) | O(n) | O(n) | Slow updates |
| Linked List | O(n) | O(1) | O(n) | O(n log n) | Slow search |
| Standard BST | O(n) worst | O(n) worst | O(n) worst | O(n) | Degenerates to linked list |
| Heap | O(n) | O(log n) | O(log n) | O(n log n) | Cannot search efficiently |
| Red-Black Tree | O(log n) | O(log n) | O(log n) | O(n) | Height up to 2·log n |
| **AVL Tree** | **O(log n)** | **O(log n)** | **O(log n)** | **O(n)** | **Height ≤ 1.44·log n** |

**Justification**:
- **Guaranteed O(log n) operations**: Unlike a standard BST, the AVL Tree never degenerates regardless of insertion order.
- **Stricter balancing than Red-Black Tree**: AVL maintains height ≤ 1.44·log₂(n), while Red-Black allows up to 2·log₂(n). For a read-heavy ranking system where lecturers and students frequently view leaderboards, AVL's shorter tree height provides faster search.
- **Instant sorted output**: A single Reverse In-Order Traversal produces the complete leaderboard in O(n) time without any additional sorting algorithm.
- **Efficient for the ranking domain**: The system requires frequent reads (view rankings) and occasional writes (enter marks), making AVL's read-optimized structure ideal.

---

## 7. Novel Features

The following novel features distinguish our system from existing solutions:

**Novel Feature 1: Live Interactive AVL Tree Data Structure Visualizer**
Unlike any existing LMS or grading system, our application renders the actual AVL Tree structure as an interactive visual graph on the web dashboard. Each node displays the student name, performance score, tree Height (H), and Balance Factor (BF). Visual connector lines link parent nodes to left (blue) and right (purple) subtrees. Zoom In/Out and Fit controls allow users to scale the tree for large datasets. This feature makes the self-balancing property directly observable and verifiable.

**Novel Feature 2: Real-Time At-Risk Student Detection with Dual-Threshold Algorithm**
The system automatically identifies at-risk students using a dual-threshold approach: Score < 50.0 (academic risk) OR Attendance < 70% (attendance risk). Unlike traditional systems that require manual report generation, our system flags at-risk students in real-time as evaluations are entered, displaying them in a dedicated warning section with batch and module filtering. This enables early academic intervention.

**Novel Feature 3: AVL Score-Based Binary Search with O(log n) Lookup**
The system provides a score-based search feature that leverages the BST property of the AVL Tree. Users enter a target score, and the system traverses Left (if target < current) or Right (if target > current) — locating matching students in O(log n) time instead of scanning all records linearly. This demonstrates a direct practical application of the AVL Tree's ordered structure.

---

## 8. Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Java 21** | Backend language; AVL Tree data structure implementation |
| **Spring Boot 3.5** | RESTful API framework; dependency injection; web server |
| **MongoDB** | NoSQL document database for persistent student/batch/module storage |
| **React.js 19** | Frontend component-based UI framework |
| **Vite** | Fast frontend build tool and development server |
| **BCrypt** | Secure password hashing for user authentication |
| **Lucide React** | Icon library for modern UI elements |
| **Gradle** | Backend build automation and dependency management |

---

## 9. Selling Points of the Application

1. **Self-Balancing Data Structure**: The AVL Tree guarantees O(log n) performance for all core operations, ensuring the system scales efficiently as student numbers grow.
2. **Live Visual Data Structure Demonstration**: The interactive AVL Tree graph is ideal for academic demonstrations, viva examinations, and teaching data structure concepts.
3. **Role-Based Multi-User System**: Supports Admin, Lecturer, and Student roles with scoped access to batches, modules, and evaluations.
4. **Real-Time Academic Intervention Alerts**: At-risk students are flagged immediately upon mark entry, enabling proactive academic support.
5. **Batch-Scoped Evaluation**: Lecturers only see and evaluate students in their assigned batches, preventing data leakage across departments.
6. **Modern Premium Web Interface**: Responsive design with glassmorphism, micro-animations, and dark-themed node cards for a professional user experience.

---

## 10. Individual Reflection

*(Each team member should write their own reflection here. Below is a template.)*

Throughout this project, I contributed to the development of the [specify: backend AVL Tree implementation / frontend dashboard / database design / testing]. My primary responsibilities included [describe specific tasks].

The most challenging aspect was [describe challenge — e.g., implementing the four AVL rotation cases (LL, RR, LR, RL) and ensuring the tree remained balanced after every insertion and deletion]. I overcame this by [describe approach — e.g., carefully tracing through examples with 5-7 nodes and verifying balance factors at each step].

I gained a deeper understanding of how self-balancing binary search trees maintain O(log n) performance and why this is critical for real-world applications involving large datasets. The experience of building a full-stack application that directly demonstrates a data structure concept has strengthened both my theoretical knowledge and practical software development skills.

---

## 11. Conclusion

This project successfully demonstrates the practical application of the AVL Tree data structure in solving the real-world problem of student performance ranking. The system efficiently manages student evaluations with guaranteed O(log n) insertion, deletion, and search operations through automatic self-balancing rotations.

The three novel features — Live Interactive AVL Tree Visualizer, Real-Time Dual-Threshold At-Risk Detection, and AVL Score-Based Binary Search — distinguish this system from existing educational management tools identified in the literature review. The full-stack implementation using Spring Boot and React.js provides a production-ready, user-friendly web application suitable for deployment in educational institutions.

The project validates that the AVL Tree is the optimal data structure choice for ranking systems due to its strict height balancing (|BF| ≤ 1), efficient sorted traversal, and guaranteed worst-case logarithmic performance — making it superior to standard BSTs, arrays, linked lists, and heaps for this application domain.

---

## 12. References

Adelson-Velsky, G.M. & Landis, E.M. (1962). An algorithm for the organization of information. *Soviet Mathematics Doklady*, 3, 1259–1263.

Cormen, T.H., Leiserson, C.E., Rivest, R.L. & Stein, C. (2022). *Introduction to Algorithms* (4th ed.). MIT Press.

Dougiamas, M. (2024). *Moodle: Open-source learning platform*. https://moodle.org/

Google. (2024). *Google Classroom*. https://classroom.google.com/

Instructure. (2024). *Canvas LMS*. https://www.instructure.com/canvas

Microsoft. (2024). *Power BI for Education*. https://powerbi.microsoft.com/

Sedgewick, R. & Wayne, K. (2011). *Algorithms* (4th ed.). Addison-Wesley.

Weiss, M.A. (2013). *Data Structures and Algorithm Analysis in Java* (3rd ed.). Pearson.

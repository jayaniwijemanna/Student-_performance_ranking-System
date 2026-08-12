# Student Performance Ranking System Using AVL Tree & Singly Linked List

---

## Table of Contents

1. Introduction
2. Problem Statement
3. Literature Review
4. Proposed Solution
5. System Functionalities
6. Selected Data Structures and Justifications
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
- Figure 4: Singly Linked List Performance History Visualizer
- Figure 5: Student Performance Leaderboard Rankings
- Figure 6: At-Risk Student Identification Dashboard

## List of Tables

- Table 1: Literature Review Comparison of Existing Systems
- Table 2: Data Structure Complexity Comparison (AVL Tree & Singly Linked List)
- Table 3: Performance Category Classification Thresholds
- Table 4: Novel Features Summary

---

## 1. Introduction

Educational institutions face increasing challenges in efficiently managing, analyzing, and ranking student academic performance across multiple modules and batches. As the number of students grows, the need for a scalable, real-time performance evaluation system becomes critical.

This report presents the development of **Scholastic Insight** — a Student Performance Ranking System that leverages two core custom data structures:
1. **AVL Tree (Adelson-Velsky and Landis Tree)**: Provides efficient, self-balancing student performance ranking and O(log n) searching based on weighted performance scores calculated using the formula: *Performance Score = (Assignment × 30%) + (Exam × 60%) + (Attendance × 10%)*.
2. **Singly Linked List**: Tracks student evaluation history over time with O(1) Head Insertion and O(n) chronological traversal, enabling automatic trend trajectory analysis (Improving, Declining, Stable) and latest score change calculation.

---

## 2. Problem Statement

Educational institutions manage large volumes of student records containing assignment marks, exam scores, attendance percentages, and module enrollments. When the number of students increases, manually identifying top-performing students, lowest-performing students, performance trends over time, and students at academic risk becomes difficult and time-consuming.

Traditional systems store records in simple arrays or databases and rely on O(n log n) sorting algorithms to generate rankings each time they are needed. This approach becomes increasingly inefficient as datasets grow. Furthermore, existing systems lack real-time visual data structure representations and historical evaluation tracking, making it difficult for educators to analyze student trajectory over time.

The core problem is the absence of a system that can:
- Insert and update student evaluations efficiently in O(log n) time using a self-balancing tree.
- Track historical performance changes chronologically using an in-memory Singly Linked List.
- Generate sorted leaderboard rankings without repeated sorting operations.
- Visually demonstrate the underlying data structures (AVL Tree and Singly Linked List).
- Automatically identify at-risk students and compute performance trends.

---

## 3. Literature Review

A review of existing student performance management tools was conducted to identify gaps and opportunities for innovation.

**Table 1: Literature Review – Existing Systems Comparison**

| System | Strengths | Limitations |
|--------|-----------|-------------|
| **Moodle LMS** (Dougiamas, 2024) | Widely adopted; grade tracking; plugin ecosystem | No real-time ranking; no data structure visualization; no linked list history tracking |
| **Google Classroom** (Google, 2024) | Simple interface; assignment management; cloud-based | No performance scoring formula; no leaderboard; no trajectory analysis |
| **Canvas LMS** (Instructure, 2024) | Analytics dashboard; grade weighting | No self-balancing data structure; batch operations slow on large datasets |
| **Power BI Education Dashboards** (Microsoft, 2024) | Advanced analytics; visualization | Requires manual data import; no custom DS processing; expensive licensing |
| **Custom BST-based systems** (Academic research) | Demonstrates BST operations | Susceptible to O(n) degeneration with sorted input; no automatic balancing or history tracking |

**Key Findings**: None of the reviewed systems implement self-balancing tree structures or custom Singly Linked Lists for real-time ranking and performance trajectory tracking. All rely on traditional database-level sorting (O(n log n)) rather than maintaining in-memory custom data structures.

---

## 4. Proposed Solution

The proposed system, **Scholastic Insight**, addresses the identified gaps by implementing a dual custom data structure architecture:
- **AVL Tree**: Organizes students by performance score for self-balancing ranking, binary search, and leaderboard generation.
- **Singly Linked List**: Maintains a chronological history chain of evaluation snapshots for each student (`HistoryNode` → `next` pointer), enabling O(1) head insertion and O(n) trajectory analysis.

**System Workflow**:
1. Lecturer enters student marks (Assignment, Exam, Attendance) via the web interface.
2. Backend calculates the weighted performance score using the formula.
3. A new `AVLNode` is created and inserted into the AVL Tree with automatic self-balancing (LL, RR, LR, RL rotations).
4. Simultaneously, a `HistoryNode` snapshot is created and inserted at the **HEAD** of the student's Singly Linked List ($O(1)$ time complexity).
5. The frontend renders both interactive visual graphs: the AVL Tree structure and the Singly Linked List node chain.
6. Rankings are generated via Reverse In-Order Traversal ($O(n)$), and performance trends are evaluated by list traversal ($O(n)$).

---

## 5. System Functionalities

The system provides the following core functionalities:

1. **User Authentication & Role-Based Access**: Admin, Lecturer, and Student roles with secure BCrypt password hashing.
2. **Batch & Module Management**: Admin can create batches (e.g., DS-2024-B1) and assign modules with credits.
3. **Student Performance Evaluation**: Lecturers enter assignment marks, exam scores, and attendance for each student per module.
4. **AVL Tree Insertion with Auto-Balancing**: Each evaluation record is inserted as an AVLNode, triggering LL, RR, LR, or RL rotations to maintain |BF| ≤ 1.
5. **Leaderboard Rankings**: Reverse In-Order Traversal generates a sorted leaderboard (Rank #1 = Highest Score) in O(n) time.
6. **Score-Based Binary Search**: Users can search for students by performance score in O(log n) time.
7. **At-Risk Student Identification**: Students with Score < 50 or Attendance < 70% are automatically flagged.
8. **Live AVL Tree Visualization**: Interactive visual graph showing each node's Height, Balance Factor, and Left/Right subtrees.
9. **Singly Linked List Performance History Tracking**: Logs chronological evaluation snapshots as linked nodes (`head` = newest entry, `next` = older entry). Provides student self-view and lecturer batch-scoped view with automatic trend analysis (Improving, Declining, Stable) and latest score change calculation.
10. **Student Dashboard**: Students can view their own performance, AVL standing, enrolled modules, and performance history timeline.
11. **Evaluation Record Deletion**: Removes a node from the AVL Tree and rebalances via the deletion algorithm.

---

## 6. Selected Data Structures and Justifications

The system utilizes two complementary custom data structures: **AVL Tree** and **Singly Linked List**.

**Table 2: Data Structure Complexity Comparison**

| Data Structure | Search | Insertion | Deletion | Traversal / Output | Primary Use Case |
|---------------|--------|-----------|----------|-------------------|------------------|
| Unsorted Array | O(n) | O(1) | O(n) | O(n log n) sort | General storage |
| Sorted Array | O(log n) | O(n) | O(n) | O(n) | Static lookups |
| Standard BST | O(n) worst | O(n) worst | O(n) worst | O(n) | Unbalanced trees |
| Heap | O(n) | O(log n) | O(log n) | O(n log n) | Top-K retrieval |
| **AVL Tree (PRIMARY)** | **O(log n)** | **O(log n)** | **O(log n)** | **O(n) (In-Order)** | **Real-Time Student Ranking** |
| **Singly Linked List (SECONDARY)** | **O(n)** | **O(1) (at Head)** | **O(1)** | **O(n) (Chronological)** | **Performance History & Trend Tracking** |

### AVL Tree Justification:
- **Guaranteed O(log n) operations**: Prevents tree degeneration into a linked list when marks are entered sequentially.
- **Stricter height balancing**: Height is capped at ≤ 1.44·log₂(n), offering faster lookups than Red-Black trees for read-heavy leaderboard queries.
- **Instant sorted leaderboard**: Reverse In-Order Traversal produces the complete ranking in O(n) time.

### Singly Linked List Justification:
- **O(1) Head Insertion**: New evaluation snapshots are linked at the HEAD of the list in constant time without traversing existing entries.
- **Chronological History Chain**: The `head` node always points to the newest entry, while `next` pointers chain backwards to older entries down to `NULL`.
- **O(1) Latest Change Calculation**: Directly computes $\Delta = \text{head.score} - \text{head.next.score}$ without searching.
- **O(n) Traversal for Trend Analysis**: Walks the list from head to tail to analyze consecutive score changes and classify student trajectory as Improving, Declining, or Stable.

---

## 7. Novel Features

The following four novel features distinguish our system from existing solutions:

**Novel Feature 1: Live Interactive AVL Tree Data Structure Visualizer**
Renders the actual AVL Tree structure as an interactive visual graph on the web dashboard. Each node displays student details, performance score, Height (H), and Balance Factor (BF), with color-coded subtree connector lines and zoom controls.

**Novel Feature 2: Singly Linked List Performance History Tracker & Trajectory Analyzer**
Implements a custom Singly Linked List (`PerformanceHistoryLinkedList`) to maintain a chronological history chain for each student. Every evaluation update creates a new `HistoryNode` linked at the **HEAD** ($O(1)$ time complexity). The system automatically computes the latest score change ($\Delta = \text{head.score} - \text{head.next.score}$) in $O(1)$ time and evaluates overall performance trajectory (Improving, Declining, Stable) across all linked nodes in $O(n)$ time. The UI displays visual `next` pointers, `HEAD`/`NULL` markers, and provides role-scoped views for students (own history) and lecturers (batch history).

**Novel Feature 3: Real-Time At-Risk Student Detection with Dual-Threshold Algorithm**
Automatically flags at-risk students using a dual-threshold rule: Score < 50.0 (academic risk) OR Attendance < 70% (attendance risk). Flagged students are displayed immediately upon mark entry in a dedicated intervention section.

**Novel Feature 4: AVL Score-Based Binary Search with O(log n) Lookup**
Leverages the BST property of the AVL Tree to locate matching students by performance score in O(log n) time by branching Left (target < current) or Right (target > current).

---

## 8. Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Java 21** | Backend language; custom AVL Tree & Singly Linked List data structure implementations |
| **Spring Boot 3.5** | RESTful API framework; dependency injection; web server |
| **MongoDB** | NoSQL document database for persistent student, batch, module, and history storage |
| **React.js 19** | Frontend component-based UI framework |
| **Vite** | Fast frontend build tool and development server |
| **BCrypt** | Secure password hashing for user authentication |
| **Lucide React** | Icon library for modern UI elements |
| **Gradle** | Backend build automation and dependency management |

---

## 9. Selling Points of the Application

1. **Dual Custom Data Structure Architecture**: Combines an AVL Tree for real-time score ranking with a Singly Linked List for performance trend tracking.
2. **Self-Balancing Guarantee**: The AVL Tree maintains height ≤ 1.44·log n, guaranteeing O(log n) lookup and update performance.
3. **O(1) History Logging**: Singly Linked List head insertion enables instant $O(1)$ evaluation snapshot logging.
4. **Live Visual Data Structure Demonstration**: Interactive AVL Tree graph and Singly Linked List chain visualizers provide direct evidence of data structure execution for viva evaluation.
5. **Role-Based Scoped Access**: Admin, Lecturer, and Student roles with strict batch-scoped data isolation.
6. **Proactive Academic Alerts**: Real-time at-risk student detection and trajectory analysis (Improving/Declining) enable early intervention.
7. **Modern Web User Experience**: Responsive design with glassmorphism, micro-animations, zoom controls, and theme tokens.

---

## 10. Individual Reflection

*(Each team member should write their own reflection here. Below is a template.)*

Throughout this project, I contributed to the development of the [specify: backend AVL Tree and Singly Linked List data structures / frontend dashboards / database architecture / testing]. My primary responsibilities included [describe specific tasks].

The most challenging aspect was [describe challenge — e.g., implementing the four AVL rotation cases (LL, RR, LR, RL) to maintain balance factors, and designing the Singly Linked List to perform O(1) head insertions while accurately evaluating multi-entry performance trajectories in O(n) time]. I overcame this by [describe approach — e.g., tracing pointer mutations step-by-step and verifying node transitions with unit tests].

I gained a deeper understanding of how combining distinct data structures (AVL Tree for ordering/ranking, Singly Linked List for sequential history) creates a powerful, efficient application. This experience has significantly enhanced my theoretical knowledge and practical software engineering capabilities.

---

## 11. Conclusion

This project successfully demonstrates the practical application of data structures in solving real-world academic management problems. By combining a self-balancing **AVL Tree** with a **Singly Linked List**, the system achieves efficient student ranking in $O(\log n)$ time and instant history logging in $O(1)$ time.

The four novel features — Live AVL Tree Visualizer, Singly Linked List History Tracker & Trajectory Analyzer, Dual-Threshold At-Risk Detection, and AVL Score-Based Binary Search — distinguish this solution from existing educational tools identified in the literature review. The full-stack implementation using Spring Boot and React.js delivers a robust, production-ready application that fulfills all academic and software engineering requirements.

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

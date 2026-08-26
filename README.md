# 🎓 Student Performance Ranking System

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![Java](https://img.shields.io/badge/Backend-Java-007396?logo=java&logoColor=white)

## 📌 Overview

The **Student Performance Ranking System** is a full-stack application designed to help educational institutions efficiently manage, analyze, search, and rank students based on their academic performance. 

At the core of the system is an **AVL Tree** data structure, which provides efficient insertion, searching, deletion, and ranking operations while automatically maintaining a balanced tree structure.

## ✨ Features

- **Efficient Data Management**: Automatically inserts and organizes student records using a self-balancing AVL Tree structure.
- **Dynamic Performance Calculation**: Computes overall performance scores based on assignments, exams, and attendance.
- **Advanced Ranking**: Generates instant student rankings (from highest to lowest and vice-versa) using In-Order and Reverse In-Order Traversals.
- **Fast Searching**: Search for student records with `O(log n)` time complexity.
- **Performance Categorization**: Automatically categorizes students (e.g., Excellent, Good, At Risk) to help lecturers identify students requiring additional support.
- **Intuitive UI**: Built with React for a seamless user experience.

## 🏗️ Architecture

The system follows a modern full-stack architecture:
- **Frontend**: Built with React (Vite) for a fast and interactive user interface.
- **Backend**: Built with Java (Spring Boot) providing robust RESTful APIs.
- **Core Data Structure**: Custom implementation of an **AVL Tree** to guarantee optimal performance (`O(log n)`) for core operations.

## 🚀 Why AVL Tree?

Traditional linear data structures (like arrays or linked lists) result in `O(n)` time complexity for searching or updating rankings, which becomes highly inefficient as the number of students grows. Standard Binary Search Trees (BSTs) can become unbalanced.

The **AVL Tree** ensures that the height difference between left and right subtrees is at most 1, keeping operations strictly at `O(log n)`. It's the perfect choice for dynamic leaderboards and ranking systems.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- Java (JDK 17+)
- Maven / Gradle

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
# Build and run your Java backend (e.g., Spring Boot)
./mvnw spring-boot:run
```

## 👥 Users of the System

- **Administrators**: Add/update/delete student records, view complete rankings, search for students, and access performance reports.
- **Lecturers**: Enter marks, view student performance, access rankings, and quickly identify students who may need academic support.

## 📜 License

This project is licensed under the MIT License.

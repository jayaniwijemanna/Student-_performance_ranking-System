package com.example.backend.ds;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AVLTree {

    private AVLNode root;

    public AVLTree() {
        this.root = null;
    }

    public AVLNode getRoot() {
        return root;
    }

    public void setRoot(AVLNode root) {
        this.root = root;
    }

    // Helper: Get height of a node
    public int height(AVLNode node) {
        return node == null ? 0 : node.getHeight();
    }

    // Helper: Get max of two integers
    private int max(int a, int b) {
        return Math.max(a, b);
    }

    // Helper: Calculate Balance Factor = Height(Left) - Height(Right)
    public int getBalance(AVLNode node) {
        if (node == null) return 0;
        return height(node.getLeft()) - height(node.getRight());
    }

    // 16.1 Right Rotation (LL Imbalance)
    private AVLNode rightRotate(AVLNode y) {
        AVLNode x = y.getLeft();
        AVLNode T2 = x.getRight();

        // Perform rotation
        x.setRight(y);
        y.setLeft(T2);

        // Update heights
        y.setHeight(max(height(y.getLeft()), height(y.getRight())) + 1);
        x.setHeight(max(height(x.getLeft()), height(x.getRight())) + 1);

        return x;
    }

    // 16.2 Left Rotation (RR Imbalance)
    private AVLNode leftRotate(AVLNode x) {
        AVLNode y = x.getRight();
        AVLNode T2 = y.getLeft();

        // Perform rotation
        y.setLeft(x);
        x.setRight(T2);

        // Update heights
        x.setHeight(max(height(x.getLeft()), height(x.getRight())) + 1);
        y.setHeight(max(height(y.getLeft()), height(y.getRight())) + 1);

        return y;
    }

    // Public Insert Entry Point
    public void insert(AVLNode node) {
        if (node == null) return;
        this.root = insertRecursive(this.root, node);
    }

    // Recursive AVL Insert with Automatic Self-Balancing
    private AVLNode insertRecursive(AVLNode current, AVLNode node) {
        // 1. Standard BST insertion
        if (current == null) {
            return node;
        }

        // Ordering by performance score (secondary key: studentId)
        if (node.getPerformanceScore() < current.getPerformanceScore()) {
            current.setLeft(insertRecursive(current.getLeft(), node));
        } else if (node.getPerformanceScore() > current.getPerformanceScore()) {
            current.setRight(insertRecursive(current.getRight(), node));
        } else {
            // Secondary key comparison if performance scores are equal
            if (node.getStudentId() != null && current.getStudentId() != null && 
                node.getStudentId().compareTo(current.getStudentId()) < 0) {
                current.setLeft(insertRecursive(current.getLeft(), node));
            } else {
                current.setRight(insertRecursive(current.getRight(), node));
            }
        }

        // 2. Update height of ancestor node
        current.setHeight(1 + max(height(current.getLeft()), height(current.getRight())));

        // 3. Get balance factor to check if node became unbalanced
        int balance = getBalance(current);

        // 4. Perform Rotations if unbalanced

        // Left-Left Case (LL) -> Right Rotation
        if (balance > 1 && node.getPerformanceScore() < current.getLeft().getPerformanceScore()) {
            return rightRotate(current);
        }

        // Right-Right Case (RR) -> Left Rotation
        if (balance < -1 && node.getPerformanceScore() > current.getRight().getPerformanceScore()) {
            return leftRotate(current);
        }

        // Left-Right Case (LR) -> Left Rotate Left Child, then Right Rotate Current
        if (balance > 1 && node.getPerformanceScore() > current.getLeft().getPerformanceScore()) {
            current.setLeft(leftRotate(current.getLeft()));
            return rightRotate(current);
        }

        // Right-Left Case (RL) -> Right Rotate Right Child, then Left Rotate Current
        if (balance < -1 && node.getPerformanceScore() < current.getRight().getPerformanceScore()) {
            current.setRight(rightRotate(current.getRight()));
            return leftRotate(current);
        }

        return current;
    }

    // Public Delete Entry Point
    public void delete(String id) {
        this.root = deleteRecursive(this.root, id);
    }

    private AVLNode deleteRecursive(AVLNode current, String id) {
        if (current == null) return null;

        // Search for node to delete
        if (current.getId() != null && current.getId().equals(id)) {
            // Node to be deleted found
            if (current.getLeft() == null || current.getRight() == null) {
                AVLNode temp = current.getLeft() != null ? current.getLeft() : current.getRight();
                if (temp == null) {
                    current = null;
                } else {
                    current = temp;
                }
            } else {
                // Node with two children: Get in-order successor (smallest in right subtree)
                AVLNode temp = minValueNode(current.getRight());
                copyNodeData(current, temp);
                current.setRight(deleteRecursive(current.getRight(), temp.getId()));
            }
        } else {
            current.setLeft(deleteRecursive(current.getLeft(), id));
            current.setRight(deleteRecursive(current.getRight(), id));
        }

        if (current == null) return null;

        // Update height & balance
        current.setHeight(1 + max(height(current.getLeft()), height(current.getRight())));
        int balance = getBalance(current);

        // Rebalance
        if (balance > 1 && getBalance(current.getLeft()) >= 0) return rightRotate(current);
        if (balance > 1 && getBalance(current.getLeft()) < 0) {
            current.setLeft(leftRotate(current.getLeft()));
            return rightRotate(current);
        }
        if (balance < -1 && getBalance(current.getRight()) <= 0) return leftRotate(current);
        if (balance < -1 && getBalance(current.getRight()) > 0) {
            current.setRight(rightRotate(current.getRight()));
            return leftRotate(current);
        }

        return current;
    }

    private AVLNode minValueNode(AVLNode node) {
        AVLNode current = node;
        while (current.getLeft() != null) {
            current = current.getLeft();
        }
        return current;
    }

    private void copyNodeData(AVLNode target, AVLNode source) {
        target.setId(source.getId());
        target.setStudentId(source.getStudentId());
        target.setStudentName(source.getStudentName());
        target.setCourseCode(source.getCourseCode());
        target.setBatchCode(source.getBatchCode());
        target.setModuleCode(source.getModuleCode());
        target.setModuleName(source.getModuleName());
        target.setAssignmentMarks(source.getAssignmentMarks());
        target.setExamMarks(source.getExamMarks());
        target.setAttendancePercentage(source.getAttendancePercentage());
        target.setPerformanceScore(source.getPerformanceScore());
        target.setPerformanceCategory(source.getPerformanceCategory());
        target.setStatus(source.getStatus());
    }

    // 17. Search by Performance Score O(log n)
    public List<AVLNode> searchByScore(double targetScore) {
        List<AVLNode> results = new ArrayList<>();
        searchByScoreRecursive(this.root, targetScore, results);
        return results;
    }

    private void searchByScoreRecursive(AVLNode current, double targetScore, List<AVLNode> results) {
        if (current == null) return;

        if (Math.abs(current.getPerformanceScore() - targetScore) < 0.1) {
            results.add(current);
        }

        if (targetScore < current.getPerformanceScore()) {
            searchByScoreRecursive(current.getLeft(), targetScore, results);
        } else if (targetScore > current.getPerformanceScore()) {
            searchByScoreRecursive(current.getRight(), targetScore, results);
        } else {
            // Equal score, search both subtrees for potential duplicates
            searchByScoreRecursive(current.getLeft(), targetScore, results);
            searchByScoreRecursive(current.getRight(), targetScore, results);
        }
    }

    // 19. Reverse In-Order Traversal (Right -> Root -> Left) to get sorted rankings (Highest to Lowest)
    public List<AVLNode> getRankedStudentsDescending() {
        List<AVLNode> list = new ArrayList<>();
        reverseInOrder(this.root, list);
        return list;
    }

    private void reverseInOrder(AVLNode current, List<AVLNode> list) {
        if (current == null) return;
        reverseInOrder(current.getRight(), list);
        list.add(current);
        reverseInOrder(current.getLeft(), list);
    }

    // 22. Get At-Risk Students (Score < 50 or Attendance < 70%)
    public List<AVLNode> getAtRiskStudents() {
        List<AVLNode> all = getRankedStudentsDescending();
        List<AVLNode> atRisk = new ArrayList<>();
        for (AVLNode n : all) {
            if (n.getPerformanceScore() < 50 || n.getAttendancePercentage() < 70 || "At Risk".equalsIgnoreCase(n.getStatus())) {
                atRisk.add(n);
            }
        }
        return atRisk;
    }

    // Static Utility: Formula Calculation (Assignment 30% + Exam 60% + Attendance 10%)
    public static double calculatePerformanceScore(double assignment, double exam, double attendance) {
        double score = (assignment * 0.30) + (exam * 0.60) + (attendance * 0.10);
        return Math.round(score * 100.0) / 100.0;
    }

    // Static Utility: Performance Category Classification
    public static String classifyPerformanceCategory(double score) {
        if (score >= 85.0) return "Excellent";
        if (score >= 75.0) return "Very Good";
        if (score >= 65.0) return "Good";
        if (score >= 50.0) return "Satisfactory";
        return "At Risk";
    }

    // Static Utility: Standing Status
    public static String classifyStatus(double score, double attendance) {
        if (score < 50.0 || attendance < 70.0) {
            return "At Risk";
        }
        return "Good Standing";
    }

    // Visual Tree Representation Exporter (For Viva Demonstration)
    public Map<String, Object> toTreeGraph() {
        return nodeToMap(this.root);
    }

    private Map<String, Object> nodeToMap(AVLNode node) {
        if (node == null) return null;
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", node.getStudentId());
        map.put("studentName", node.getStudentName());
        map.put("performanceScore", node.getPerformanceScore());
        map.put("performanceCategory", node.getPerformanceCategory());
        map.put("status", node.getStatus());
        map.put("height", node.getHeight());
        map.put("balanceFactor", getBalance(node));
        map.put("left", nodeToMap(node.getLeft()));
        map.put("right", nodeToMap(node.getRight()));
        return map;
    }
}

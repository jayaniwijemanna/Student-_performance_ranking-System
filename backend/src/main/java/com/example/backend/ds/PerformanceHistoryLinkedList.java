package com.example.backend.ds;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * PerformanceHistoryLinkedList — A Singly Linked List data structure
 * that tracks a student's performance evaluation history over time.
 *
 * Each node in the list represents one evaluation snapshot. Nodes are
 * linked from newest (head) → oldest (tail), forming a chronological
 * history chain.
 *
 * Operations:
 *   - insertAtHead(node)     : O(1) — Adds a new evaluation entry at the head
 *   - getSize()              : O(1) — Returns the number of history entries
 *   - traverse()             : O(n) — Returns all entries from newest to oldest
 *   - getTrend()             : O(n) — Analyzes score changes to determine trend
 *   - getScoreChange()       : O(1) — Compares the latest 2 entries
 *   - toListOfMaps()         : O(n) — Serializes the list for JSON API response
 */
public class PerformanceHistoryLinkedList {

    // Head pointer — points to the newest (most recent) history entry
    private HistoryNode head;

    // Size counter — tracks the number of nodes in the linked list
    private int size;

    // --- Constructor ---
    public PerformanceHistoryLinkedList() {
        this.head = null;
        this.size = 0;
    }

    /**
     * Insert a new history entry at the head of the linked list.
     *
     * The new node becomes the head, and its 'next' pointer links to
     * the previous head. This ensures the most recent entry is always
     * at the front of the list.
     *
     * Time Complexity: O(1)
     *
     * @param newNode The new HistoryNode to insert
     */
    public void insertAtHead(HistoryNode newNode) {
        if (newNode == null) return;

        // Point new node's next to current head
        newNode.setNext(this.head);

        // Update head to point to new node
        this.head = newNode;

        // Increment size counter
        this.size++;
    }

    /**
     * Traverse the entire linked list from head (newest) to tail (oldest).
     *
     * Starting from the head node, follow each 'next' pointer until null
     * is reached. Collect all nodes into a list.
     *
     * Time Complexity: O(n) where n = number of entries
     *
     * @return List of all HistoryNodes from newest to oldest
     */
    public List<HistoryNode> traverse() {
        List<HistoryNode> result = new ArrayList<>();
        HistoryNode current = this.head;

        // Walk through the linked list following next pointers
        while (current != null) {
            result.add(current);
            current = current.getNext(); // Move to the next (older) node
        }

        return result;
    }

    /**
     * Determine the student's performance trend by analyzing score changes
     * across all history entries.
     *
     * Algorithm:
     *   1. Traverse the list from newest → oldest
     *   2. Compare consecutive scores
     *   3. Count increases, decreases, and stable transitions
     *   4. Return "Improving" if increases > decreases,
     *      "Declining" if decreases > increases,
     *      "Stable" otherwise
     *
     * Time Complexity: O(n) — single traversal
     *
     * @return "Improving" | "Declining" | "Stable" | "Insufficient Data"
     */
    public String getTrend() {
        if (this.size < 2) {
            return "Insufficient Data";
        }

        int increases = 0;
        int decreases = 0;

        HistoryNode current = this.head;
        while (current != null && current.getNext() != null) {
            double currentScore = current.getPerformanceScore();
            double olderScore = current.getNext().getPerformanceScore();

            // Compare current entry with the older entry
            if (currentScore > olderScore) {
                increases++;    // Score went up from old → new
            } else if (currentScore < olderScore) {
                decreases++;   // Score went down from old → new
            }
            // If equal, neither count increments (stable transition)

            current = current.getNext();
        }

        if (increases > decreases) {
            return "Improving";
        } else if (decreases > increases) {
            return "Declining";
        } else {
            return "Stable";
        }
    }

    /**
     * Calculate the score change between the latest (head) and the
     * second-latest entry.
     *
     * Time Complexity: O(1) — only accesses head and head.next
     *
     * @return The difference (latest - previous), or 0.0 if < 2 entries
     */
    public double getScoreChange() {
        if (this.head == null || this.head.getNext() == null) {
            return 0.0;
        }
        return this.head.getPerformanceScore() - this.head.getNext().getPerformanceScore();
    }

    /**
     * Serialize the linked list into a list of Maps for JSON API response.
     *
     * Each node is converted to a Map containing all its data fields plus
     * the trend and score change metadata for the entire history.
     *
     * Time Complexity: O(n) — single traversal
     *
     * @return List of Maps representing each history entry
     */
    public List<Map<String, Object>> toListOfMaps() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<HistoryNode> nodes = traverse();

        int index = 1; // 1-indexed entry number (1 = newest)
        for (HistoryNode node : nodes) {
            Map<String, Object> map = new HashMap<>();
            map.put("entryNumber", index++);
            map.put("entryId", node.getEntryId());
            map.put("studentId", node.getStudentId());
            map.put("studentName", node.getStudentName());
            map.put("moduleCode", node.getModuleCode());
            map.put("moduleName", node.getModuleName());
            map.put("batchCode", node.getBatchCode());
            map.put("assignmentMarks", node.getAssignmentMarks());
            map.put("examMarks", node.getExamMarks());
            map.put("attendancePercentage", node.getAttendancePercentage());
            map.put("performanceScore", node.getPerformanceScore());
            map.put("performanceCategory", node.getPerformanceCategory());
            map.put("status", node.getStatus());
            map.put("timestamp", node.getTimestamp() != null ? node.getTimestamp().toString() : null);
            map.put("action", node.getAction());
            result.add(map);
        }

        return result;
    }

    /**
     * Build a complete summary response including list entries, trend,
     * score change, and list metadata.
     *
     * @return Map with keys: "entries", "trend", "scoreChange", "totalEntries"
     */
    public Map<String, Object> toSummaryResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("entries", toListOfMaps());
        response.put("trend", getTrend());
        response.put("scoreChange", Math.round(getScoreChange() * 100.0) / 100.0);
        response.put("totalEntries", this.size);
        return response;
    }

    // --- Getters ---
    public HistoryNode getHead() { return head; }
    public int getSize() { return size; }
}

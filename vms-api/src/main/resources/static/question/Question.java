// package com.wso2.vms.api.question;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.List;

// @Entity
// @Table(name = "questions")
// public class Question {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false, columnDefinition = "TEXT")
//     private String text;

//     @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<Option> options = new ArrayList<>();

//     @Column(nullable = false)
//     private Integer correctOptionIndex;

//     @Column(length = 500)
//     private String explanation;

//     @Column(nullable = false)
//     private LocalDateTime createdAt = LocalDateTime.now();

//     public void addOption(Option option) {
//         options.add(option);
//         option.setQuestion(this);
//     }

//     public void removeOption(Option option) {
//         options.remove(option);
//         option.setQuestion(null);
//     }

//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getText() {
//         return text;
//     }

//     public void setText(String text) {
//         this.text = text;
//     }

//     public List<Option> getOptions() {
//         return options;
//     }

//     public void setOptions(List<Option> options) {
//         this.options = options;
//     }

//     public Integer getCorrectOptionIndex() {
//         return correctOptionIndex;
//     }

//     public void setCorrectOptionIndex(Integer correctOptionIndex) {
//         this.correctOptionIndex = correctOptionIndex;
//     }

//     public String getExplanation() {
//         return explanation;
//     }

//     public void setExplanation(String explanation) {
//         this.explanation = explanation;
//     }

//     public LocalDateTime getCreatedAt() {
//         return createdAt;
//     }

//     public void setCreatedAt(LocalDateTime createdAt) {
//         this.createdAt = createdAt;
//     }

// }

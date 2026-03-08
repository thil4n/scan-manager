// package com.wso2.vms.api.question;

// import jakarta.persistence.*;

// @Entity
// @Table(name = "question_options")
// public class Option {

// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// @ManyToOne(fetch = FetchType.LAZY, optional = false)
// @JoinColumn(name = "question_id", nullable = false)
// private Question question;

// @Column(nullable = false, columnDefinition = "TEXT")
// private String text;

// @Column(nullable = false)
// private Integer optionIndex;

// // getters & setters

// public Long getId() {
// return id;
// }

// public void setId(Long id) {
// this.id = id;
// }

// public Question getQuestion() {
// return question;
// }

// public void setQuestion(Question question) {
// this.question = question;
// }

// public String getText() {
// return text;
// }

// public void setText(String text) {
// this.text = text;
// }

// public Integer getOptionIndex() {
// return optionIndex;
// }

// }

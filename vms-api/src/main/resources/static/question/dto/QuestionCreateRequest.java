package com.wso2.vms.api.question.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class QuestionCreateRequest {

    @NotBlank
    private String questionText;

    @NotNull
    private QuestionType questionType;

    private boolean multipleOptions;

    @Min(2)
    @Max(5)
    private int optionCount;

    private List<String> images;

    // For SIMPLE MCQ
    private List<OptionRequest> options;

    // For TWO SENTENCES
    private String sentenceOne;
    private String sentenceTwo;

    // getters & setters

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getSentenceOne() {
        return sentenceOne;
    }

    public void setSentenceOne(String sentenceOne) {
        this.sentenceOne = sentenceOne;
    }

    public String getSentenceTwo() {
        return sentenceTwo;
    }

    public void setSentenceTwo(String sentenceTwo) {
        this.sentenceTwo = sentenceTwo;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }
}

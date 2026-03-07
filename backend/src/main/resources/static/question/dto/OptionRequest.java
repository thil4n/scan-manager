package com.wso2.vms.question.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class OptionRequest {

    @NotBlank
    @Min(1)
    @Max(5)
    private int optionId;

    @NotBlank
    private String optionText;

    @NotBlank
    private String optionImage;

    public int getOptionId() {
        return optionId;
    }

    public String getOptionText() {
        return optionText;
    }

    public String getOptionImage() {
        return optionImage;
    }

    public void setOptionId(int optionId) {
        this.optionId = optionId;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public void setOptionImage(String optionImage) {
        this.optionImage = optionImage;
    }
}

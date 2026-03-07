// package com.wso2.vms.question;

// import jakarta.validation.Valid;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import com.wso2.vms.question.dto.QuestionDTO;

// import java.io.IOException;
// import java.util.List;

// @RestController
// @RequestMapping("/api/question")
// public class QuestionController {

//         private final QuestionService questionService;

//         public QuestionController(QuestionService questionService) {
//                 this.questionService = questionService;
//         }

//         @PostMapping
//         @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'OPERATOR')")
//         public ResponseEntity<QuestionResponse> createQuestion(@Valid @ModelAttribute QuestionDTO request)
//                         throws IOException {
//                 return ResponseEntity.ok(questionService.createQuestion(request));
//         }

//         @PatchMapping("/{id}")
//         @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'OPERATOR')")
//         public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long id,
//                         @RequestBody QuestionDTO request) {
//                 return ResponseEntity.ok(questionService.updateQuestion(id, request));
//         }

//         @GetMapping("/{id}")
//         @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'OPERATOR')")
//         public QuestionResponse getQuestionById(@PathVariable Long id) {
//                 return questionService.getQuestionById(id);
//         }

//         @GetMapping
//         @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'OPERATOR')")
//         public List<QuestionResponse> getAllQuestions() {
//                 return questionService.getAllQuestions();
//         }

// }

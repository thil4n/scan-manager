// package com.wso2.vms.question;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import com.wso2.vms.operator.StudentRepository;
// import com.wso2.vms.question.dto.QuestionDTO;

// import java.io.IOException;
// import java.nio.file.Path;
// import java.nio.file.Paths;

// import java.util.List;

// import static org.springframework.http.HttpStatus.NOT_FOUND;

// @Service
// public class QuestionService {

// private final QuestionRepository recordRepository;
// private final StudentRepository studentRepository;

// @Value("${file.upload-dir}")
// private String uploadDir;

// public QuestionService(QuestionRepository recordRepository,
// StudentRepository studentRepository) {
// this.recordRepository = recordRepository;
// this.studentRepository = studentRepository;
// }

// public QuestionResponse createQuestion(QuestionDTO request) throws
// IOException {
// // Student student = studentRepository.findById(1L)
// // .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Student not
// // found"));

// // Question record = new Question(student, LocalDateTime.now());

// // saveFiles(record, request.getFiles());

// // Question saved = recordRepository.save(record);

// // return toQuestionResponse(saved);
// return null;
// }

// public QuestionResponse updateQuestion(Long id, QuestionDTO request) {
// // Question record = recordRepository.findById(id)
// // .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Question not
// // found"));

// // if (request.getComplaint() != null)
// // record.setComplaint(request.getComplaint());
// // if (request.getDiagnosis() != null)
// // record.setDiagnosis(request.getDiagnosis());
// // if (request.getPrescription() != null)
// // record.setPrescription(request.getPrescription());
// // if (request.getDoctorNotes() != null)
// // record.setDoctorNotes(request.getDoctorNotes());

// // return toQuestionResponse(recordRepository.save(record));
// return null;
// }

// public QuestionResponse getQuestionById(Long id) {
// // Question record = recordRepository.findById(id)
// // .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Question not
// // found"));
// // return toQuestionResponse(record);
// return null;
// }

// public List<QuestionResponse> getAllQuestions() {
// return recordRepository.findAll().stream()
// .map(this::toQuestionResponse)
// .toList();
// }

// public List<QuestionResponse> getQuestionsByStudent(Long studentId) {
// // Student student = studentRepository.findById(studentId)
// // .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Student not
// // found"));

// // return recordRepository.findByStudentId(studentId).stream()
// // .map(this::toQuestionResponse)
// // .toList();
// return null;
// }

// private void saveFiles(Question record, List<MultipartFile> files) throws
// IOException {
// if (files == null || files.isEmpty())
// return;

// Path uploadPath = Paths.get(System.getProperty("user.dir"), uploadDir);
// // for (MultipartFile file : files) {
// // String uniqueFileName = UUID.randomUUID() + "_" +
// file.getOriginalFilename();
// // file.transferTo(uploadPath.resolve(uniqueFileName).toFile());
// // record.getFiles().add(new ThumbnailFile(record, uniqueFileName));
// // }
// }

// private QuestionResponse toQuestionResponse(Question record) {
// QuestionResponse response = new QuestionResponse();
// // response.setId(record.getId());
// // response.setQuestionDate(record.getQuestionDate());
// // response.setComplaint(record.getComplaint());
// // response.setDiagnosis(record.getDiagnosis());
// // response.setPrescription(record.getPrescription());
// // response.setDoctorNotes(record.getDoctorNotes());
// // response.setStudent(new QuestionResponse.StudentInfo(
// // record.getStudent().getId(),
// // record.getStudent().getName()));
// // response.setFiles(record.getFiles().stream()
// // .map(f -> f.getFileName())
// // .toList());
// // return response;
// return null;
// }
// }

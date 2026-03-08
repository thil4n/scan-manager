// package com.wso2.vms.api.email;

// import jakarta.mail.internet.MimeMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
// import org.springframework.stereotype.Service;

// @Service
// public class EmailService {

// private final JavaMailSender mailSender;

// public EmailService(JavaMailSender mailSender) {
// this.mailSender = mailSender;
// }

// public String sendMail(
// String to,
// String subject,
// String text,
// String html) {

// try {
// MimeMessage message = mailSender.createMimeMessage();
// MimeMessageHelper helper = new MimeMessageHelper(message, true);

// helper.setFrom("Eminence POS <no-reply@wso2.com>");
// helper.setTo(to);
// helper.setSubject(subject);

// if (html != null) {
// helper.setText(text, html);
// } else {
// helper.setText(text, false);
// }

// mailSender.send(message);
// return message.getMessageID();

// } catch (Exception e) {
// throw new RuntimeException("Failed to send email", e);
// }
// }
// }

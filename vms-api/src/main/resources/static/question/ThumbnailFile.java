// package com.wso2.vms.api.question;

// import jakarta.persistence.*;

// @Entity
// @Table(name = "THUMBNAIL_FILES")
// public class ThumbnailFile {

// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// @ManyToOne(optional = false)
// @JoinColumn(name = "record_id", nullable = false)
// private Option record;

// @Column(nullable = false)
// private String fileName;

// public ThumbnailFile() {
// }

// public ThumbnailFile(Option record, String fileName) {
// this.record = record;
// this.fileName = fileName;
// }

// // Getters and setters
// public Long getId() {
// return id;
// }

// public void setId(Long id) {
// this.id = id;
// }

// public Option getOption() {
// return record;
// }

// public void setOption(Option record) {
// this.record = record;
// }

// public String getFileName() {
// return fileName;
// }

// public void setFileName(String fileName) {
// this.fileName = fileName;
// }
// }
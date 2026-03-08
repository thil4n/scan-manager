package com.wso2.vms.api.exception;

import java.util.List;
import java.util.NoSuchElementException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.http.converter.HttpMessageNotReadableException;

import io.jsonwebtoken.ExpiredJwtException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        // ------------------ HELPERS ------------------

        private void logWarn(Exception ex, HttpServletRequest request) {
                logger.warn("[{} {}] {}",
                                request.getMethod(),
                                request.getRequestURI(),
                                ex.getMessage());
        }

        private void logInfo(Exception ex, HttpServletRequest request) {
                logger.info("[{} {}] {}",
                                request.getMethod(),
                                request.getRequestURI(),
                                ex.getMessage());
        }

        private void logError(Exception ex, HttpServletRequest request) {
                logger.error("[{} {}] Unhandled exception",
                                request.getMethod(),
                                request.getRequestURI(),
                                ex);
        }

        private ApiError processFieldErrors(
                        List<FieldError> fieldErrors,
                        String path) {
                ApiError error = new ApiError(
                                400,
                                "Validation Failed",
                                "Invalid request fields",
                                path);

                for (FieldError fieldError : fieldErrors) {
                        error.addFieldError(
                                        fieldError.getField(),
                                        fieldError.getDefaultMessage());
                }
                return error;
        }

        // ------------------ 400 ------------------

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ApiError> handleTypeMismatch(
                        MethodArgumentTypeMismatchException ex,
                        HttpServletRequest request) {
                logWarn(ex, request);

                String message = String.format(
                                "Parameter '%s' has invalid value",
                                ex.getName());

                ApiError error = new ApiError(
                                400,
                                "Bad Request",
                                message,
                                request.getRequestURI());
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiError> handleValidation(
                        MethodArgumentNotValidException ex,
                        HttpServletRequest request) {
                logWarn(ex, request);

                BindingResult result = ex.getBindingResult();
                ApiError error = processFieldErrors(
                                result.getFieldErrors(),
                                request.getRequestURI());
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler({ IllegalArgumentException.class, NullPointerException.class,
                        HttpMessageNotReadableException.class })
        public ResponseEntity<ApiError> handleBadRequest(
                        Exception ex,
                        HttpServletRequest request) {
                logWarn(ex, request);

                ApiError error = new ApiError(
                                400,
                                "Bad Request",
                                ex.getMessage(),
                                request.getRequestURI());
                return ResponseEntity.badRequest().body(error);
        }

        // ------------------ 401 ------------------

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ApiError> handleBadCredentials(
                        BadCredentialsException ex,
                        HttpServletRequest request) {
                logger.warn("[{}] Invalid login attempt",
                                request.getRequestURI());

                ApiError error = new ApiError(
                                401,
                                "Unauthorized",
                                "Invalid username or password",
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // ------------------ 403 ------------------

        @ExceptionHandler({
                        AccessDeniedException.class,
                        ExpiredJwtException.class
        })
        public ResponseEntity<ApiError> handleForbidden(
                        Exception ex,
                        HttpServletRequest request) {
                logWarn(ex, request);

                ApiError error = new ApiError(
                                403,
                                "Forbidden",
                                "Access denied",
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // ------------------ 404 ------------------

        @ExceptionHandler({
                        NoSuchElementException.class,
                        EntityNotFoundException.class,
                        ResourceAlreadyExistsException.class,
                        NoResourceFoundException.class })
        public ResponseEntity<ApiError> handleNotFound(
                        Exception ex,
                        HttpServletRequest request) {
                logInfo(ex, request);

                ApiError error = new ApiError(
                                404,
                                "Not Found",
                                ex.getMessage(),
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // ------------------ OTHER ------------------

        @ExceptionHandler(ResponseStatusException.class)
        public ResponseEntity<ApiError> handleResponseStatus(
                        ResponseStatusException ex,
                        HttpServletRequest request) {
                logWarn(ex, request);

                ApiError error = new ApiError(
                                ex.getStatusCode().value(),
                                ex.getStatusCode().toString(),
                                ex.getReason(),
                                request.getRequestURI());
                return ResponseEntity.status(ex.getStatusCode()).body(error);
        }

        // ------------------ 500 ------------------

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiError> handleGeneric(
                        Exception ex,
                        HttpServletRequest request) {
                logError(ex, request);

                ApiError error = new ApiError(
                                500,
                                "Internal Server Error",
                                "An unexpected error occurred",
                                request.getRequestURI());
                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(error);
        }
}

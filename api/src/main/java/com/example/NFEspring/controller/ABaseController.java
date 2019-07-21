package com.example.NFEspring.controller;

import javassist.NotFoundException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import com.example.NFEspring.utils.SerializableUtils;

@Order(Ordered.LOWEST_PRECEDENCE - 1)
@ControllerAdvice
public abstract class ABaseController extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException exception, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return ResponseEntity
                .badRequest()
                .body(SerializableUtils.singletonMap("error", "Malformed JSON request"));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleGoneException(NotFoundException exception) {
        return ResponseEntity
                .status(HttpStatus.GONE)
                .body(SerializableUtils.singletonMap("error", exception.getMessage()));
    }

    @ExceptionHandler(NoSuchFieldException.class)
    public ResponseEntity<?> handleNoSuchFieldException(NoSuchFieldException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(SerializableUtils.singletonMap("error", exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException exception) {
        exception.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(SerializableUtils.singletonMap("error", exception.getMessage()));
    }

    /* @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, ?> handleRuntimeException(RuntimeException exception) {
        exception.printStackTrace();

        return SerializableUtils.singletonMap("error", exception.getMessage());
    } */

}

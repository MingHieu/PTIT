package com.findjb.findjob.Constraint;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import com.findjb.findjob.Repositories.UserRepository;

@Component
public class UniqueValidator implements ConstraintValidator<Unique, String> {
    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return userRepository.findByUsername(email) == null;
    }
}

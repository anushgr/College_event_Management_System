package com.eventmanagement.config;

import com.eventmanagement.model.User;
import com.eventmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User organizer = new User();
            organizer.setUsername("admin");
            organizer.setEmail("admin@eventmanager.com");
            organizer.setPassword(passwordEncoder.encode("admin123"));
            organizer.setRole(User.Role.ORGANIZER);
            userRepository.save(organizer);
            log.info("✅ Default organizer created: username='admin', password='admin123'");
        } else {
            log.info("✅ Connected to Neon PostgreSQL. Default organizer already exists.");
        }
    }
}

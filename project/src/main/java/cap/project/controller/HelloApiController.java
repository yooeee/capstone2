package cap.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloApiController {
    
    
    @GetMapping("/api/hello")
    public String getMethodName() {
        return "Hello World!";
    }
    
}
package cap.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Controller
@RequestMapping("/main")
public class HelloController {
    
    
    @GetMapping("/map")
    public String getMethodName() {
        return "app";
    }
    
}
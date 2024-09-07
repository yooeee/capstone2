package cap.project.api;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cap.project.entity.Test;
import cap.project.service.TestService;


@RestController
@RequestMapping("/api/proxy")
public class TestApiController {

    @Autowired
    private TestService testService;

    @GetMapping("")
    public String getMethodName() {
        List<Test> list = testService.getAllTests();
        String name = list.get(0).getName();
        return name;
    }
    
}

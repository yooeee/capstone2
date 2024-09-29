package cap.project.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cap.project.entity.SggAdmcode;
import cap.project.service.AdmcodeService;

@RestController
@RequestMapping("/api/admcode")
public class AdmcodeApiController {

    @Autowired
    private AdmcodeService admcodeService;

    @GetMapping("")
    public List<SggAdmcode> getMethodName(@RequestParam String bjcd) {
        List<SggAdmcode> result = admcodeService.getSggAdmcodesByBjcd(bjcd);
        return result;
    }

}

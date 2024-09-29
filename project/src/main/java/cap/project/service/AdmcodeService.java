package cap.project.service;


import java.util.List;
import cap.project.entity.SggAdmcode;

public interface AdmcodeService  {
    List<SggAdmcode> getSggAdmcodesByBjcd(String bjcd);
}

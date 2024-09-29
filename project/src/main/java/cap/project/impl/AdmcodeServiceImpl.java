package cap.project.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cap.project.entity.SggAdmcode;
import cap.project.repository.AdmcodeRepository;
import cap.project.service.AdmcodeService;

@Service
public class AdmcodeServiceImpl implements AdmcodeService {

    @Autowired
    private AdmcodeRepository admcodeRepository;

    @Override
    public List<SggAdmcode> getSggAdmcodesByBjcd(String bjcd) {
        return admcodeRepository.findByBjcdStartingWith(bjcd);
    }
}

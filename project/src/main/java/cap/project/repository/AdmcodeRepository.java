package cap.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cap.project.entity.SggAdmcode;

@Repository
public interface AdmcodeRepository extends JpaRepository<SggAdmcode, Integer> {
    List<SggAdmcode> findByBjcdStartingWith(String bjcd);
}
package cap.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cap.project.entity.Test;

@Repository
public interface TestRepository extends JpaRepository<Test, Integer> {
}
package cap.project.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sgg_admcode")
public class SggAdmcode {

    @Id
    @Column(nullable = false)
    private String bjcd;

    @Column(nullable = false)
    private String name;

    public String getBjcd() {
        return bjcd;
    }

    public void setBjcd(String bjcd) {
        this.bjcd = bjcd;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

 
}
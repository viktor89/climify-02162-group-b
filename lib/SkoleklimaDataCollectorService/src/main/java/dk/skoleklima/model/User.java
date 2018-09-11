package dk.skoleklima.model;

import java.io.Serializable;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class User implements Serializable{

	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", unique = true, nullable = false)
	private Long id;
	
	private String name;
	private String email;
	private String dob;
	private String password;
	private String gender;
	
	@ManyToOne
    @JoinColumn(name="role_id", nullable=false)
	private RoleTable role;
	
	@OneToMany(cascade=CascadeType.ALL)
	private Set<SchoolMaster> schoolData;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public RoleTable getRole() {
		return role;
	}

	public void setRole(RoleTable role) {
		this.role = role;
	}

	public Set<SchoolMaster> getSchoolData() {
		return schoolData;
	}

	public void setSchoolData(Set<SchoolMaster> schoolData) {
		this.schoolData = schoolData;
	}

}

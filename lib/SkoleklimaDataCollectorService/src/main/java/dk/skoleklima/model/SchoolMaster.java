package dk.skoleklima.model;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class SchoolMaster implements Serializable {
	private static final long serialVersionUID = -5531668659384518602L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Long id;
	
	private String schoolName;
	private String address;
	
	@OneToMany(cascade=CascadeType.ALL)
	private Set<RosberrypiData> rosberrypaidata;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSchoolName() {
		return schoolName;
	}

	public void setSchoolName(String schoolName) {
		this.schoolName = schoolName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Set<RosberrypiData> getRosberrypaidata() {
		return rosberrypaidata;
	}

	public void setRosberrypaidata(Set<RosberrypiData> rosberrypaidata) {
		this.rosberrypaidata = rosberrypaidata;
	}
	
	

}

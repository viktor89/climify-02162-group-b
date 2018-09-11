package dk.skoleklima.model;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class SensorData {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", unique = true, nullable = false)
	private Long id;

	private String thingTypeUID;
	private String uid;
	private String address;
	
	//@JsonIgnore
	@ManyToOne(cascade=CascadeType.ALL)
	private RosberrypiData rasberyPi;
	
	//@JsonIgnore
	@OneToMany(mappedBy = "sensordate",cascade=CascadeType.ALL)
	private List<SensorLinkedItem> sensorItemData = new ArrayList<>();

	
	public String getUid() {
		return uid;
	}


	public void setUid(String uid) {
		this.uid = uid;
	}


	@Override
	public String toString() {
		return thingTypeUID;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getThingTypeUID() {
		return thingTypeUID;
	}


	public void setThingTypeUID(String thingTypeUID) {
		this.thingTypeUID = thingTypeUID;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	public RosberrypiData getRasberyPi() {
		return rasberyPi;
	}


	public void setRasberyPi(RosberrypiData rasberyPi) {
		this.rasberyPi = rasberyPi;
	}


	public List<SensorLinkedItem> getSensorItemData() {
		return sensorItemData;
	}


	public void setSensorItemData(List<SensorLinkedItem> sensorItemData) {
		this.sensorItemData = sensorItemData;
	}

	
}

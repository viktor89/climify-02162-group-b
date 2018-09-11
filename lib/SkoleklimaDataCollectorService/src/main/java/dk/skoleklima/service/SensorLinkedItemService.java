package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dk.skoleklima.model.SensorLinkedItem;
import dk.skoleklima.repository.SensorLinkedItemRepository;

@Service("sensorLinkedItemService")
public class SensorLinkedItemService {
	
	@Autowired
	SensorLinkedItemRepository sr;
	
	public List<SensorLinkedItem> findItemBySensor(Long sensorId){
		return sr.selectByLinkedItemBySensor(sensorId);
	}
	
	public SensorLinkedItem saveUdate(SensorLinkedItem si) {
		return sr.save(si);
	}
	
	public SensorLinkedItem findOne(Long id) {
		return sr.findOne(id);
	}

	public List<SensorLinkedItem> findByRassbery(Long id) {
		return sr.getThermostatSensorLinkedByRassbery(id);
	}

	
}


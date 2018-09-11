package dk.skoleklima.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import dk.skoleklima.model.SensorData;
import dk.skoleklima.model.SensorLinkedItem;

public interface SensorLinkedItemRepository extends Serializable, PagingAndSortingRepository<SensorLinkedItem, Long> {
	
	@Query("from SensorLinkedItem where sensordate.id = ?1")
	  public List<SensorLinkedItem> selectByLinkedItemBySensor(Long id);
	
	@Query("from SensorLinkedItem where sensordate.rasberyPi.id = ?1 and readOnly=false")
	  public List<SensorLinkedItem> getThermostatSensorLinkedByRassbery(Long id);

}

package dk.skoleklima.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import dk.skoleklima.model.SensorData;



public interface SensorRepository extends Serializable, PagingAndSortingRepository<SensorData, Long> {
	
	@Query("from SensorData where uid = ?1")
	  public SensorData selectBySensorUid(String sensorUid);
	
	@Query("from SensorData where rasberyPi.id = ?1")
	  public List<SensorData> selectBySensorRosberrypai(Long id);
	
}

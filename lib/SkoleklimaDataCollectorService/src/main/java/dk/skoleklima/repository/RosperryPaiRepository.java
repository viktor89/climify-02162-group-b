package dk.skoleklima.repository;

import java.io.Serializable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import dk.skoleklima.model.RosberrypiData;
import dk.skoleklima.model.SensorData;

public interface RosperryPaiRepository extends Serializable, PagingAndSortingRepository<RosberrypiData, Long> {
	
	@Query("from RosberrypiData where rosberryName = ?1")
	  public RosberrypiData byName(String name);

}

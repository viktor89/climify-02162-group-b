package dk.skoleklima.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import dk.skoleklima.model.ExtensionMaster;
import dk.skoleklima.model.SensorData;


public interface ExtensionRepository extends Serializable, PagingAndSortingRepository<ExtensionMaster, Long>{
	@Query("from ExtensionMaster em where em.installed = false and type='binding' and link is not null")
	  public List<ExtensionMaster> getNotInstalledExtension();
	
	@Query("from ExtensionMaster em where em.installed = true and type='binding' and link is not null")
	  public List<ExtensionMaster> getInstalledExtension();
}

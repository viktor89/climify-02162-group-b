package dk.skoleklima.repository;

import java.io.Serializable;
import org.springframework.data.repository.PagingAndSortingRepository;
import dk.skoleklima.model.RoleTable;


public interface RoleRepository extends Serializable, PagingAndSortingRepository<RoleTable, Long>{//Correspond to the RoleTable

}

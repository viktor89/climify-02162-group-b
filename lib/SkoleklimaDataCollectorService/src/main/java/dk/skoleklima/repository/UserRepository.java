package dk.skoleklima.repository;

import java.io.Serializable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import dk.skoleklima.model.SensorData;
import dk.skoleklima.model.User;

public interface UserRepository extends Serializable, PagingAndSortingRepository<User, Long> {
	
	@Query("from User where email = ?1 and password = ?2")
	  public User authrizeLogin(String email, String password);

}

package dk.skoleklima.repository;

import java.io.Serializable;

import org.springframework.data.repository.PagingAndSortingRepository;

import dk.skoleklima.model.BindingData;
 
// PagingAndSortingRepository: Extension of CrudRepository to provide additional methods to retrieve entities using the pagination and sorting abstraction.
public interface BindingRepository extends Serializable, PagingAndSortingRepository<BindingData, Long> {

}

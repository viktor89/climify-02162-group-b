package dk.skoleklima.repository;

import java.io.Serializable;

import org.springframework.data.repository.PagingAndSortingRepository;

import dk.skoleklima.model.SchoolMaster;

public interface SchoolRepository extends Serializable, PagingAndSortingRepository<SchoolMaster, Long> {

}

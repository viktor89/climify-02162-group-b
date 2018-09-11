package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dk.skoleklima.model.SchoolMaster;
import dk.skoleklima.repository.SchoolRepository;

@Service("schoolService")
public class SchoolService {
	
	@Autowired
	private SchoolRepository schoolRepo;
	
	public List<SchoolMaster> listSchool(){
		return (List<SchoolMaster>) schoolRepo.findAll();
	}
	
	public SchoolMaster oneSchool(Long id){
		return  schoolRepo.findOne(id);
	}
	
	public SchoolMaster saveSchool(SchoolMaster school){
		return  schoolRepo.save(school);
	}
	
	public void deleteSchool(Long id){
		schoolRepo.delete(id);
	}
	

}

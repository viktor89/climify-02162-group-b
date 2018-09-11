package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dk.skoleklima.model.RoleTable;
import dk.skoleklima.repository.RoleRepository;

@Service("roleService")
public class RoleService {
	
	//DI(Dependency injection)
	@Autowired
	private RoleRepository rr;
	
	public List<RoleTable> ListAllRole(){
		return (List<RoleTable>) rr.findAll();
	}
	
	public RoleTable findOne(Long id) {
		return rr.findOne(id);
	}

	public RoleTable saveUpdate(RoleTable rt) {
		return rr.save(rt);
	}

}

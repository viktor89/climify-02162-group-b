package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dk.skoleklima.model.ExtensionMaster;
import dk.skoleklima.repository.ExtensionRepository;

@Service("extensionService")
public class ExtensionService {
	
	@Autowired
	ExtensionRepository er;
	
	public void save(List<ExtensionMaster> le) {
		 er.save(le);
	}
	
	public List<ExtensionMaster> listAllExtension(){
		return er.getNotInstalledExtension();
	}
   
	public List<ExtensionMaster> listAllInstalledExtension(){
		return er.getInstalledExtension();
	}
	
}

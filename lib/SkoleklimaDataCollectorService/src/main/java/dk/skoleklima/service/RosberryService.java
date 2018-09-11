package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dk.skoleklima.model.RosberrypiData;
import dk.skoleklima.repository.RosperryPaiRepository;

@Service("rosberryService")
public class RosberryService {
	
	@Autowired
	RosperryPaiRepository rr;
	
	public List<RosberrypiData> getAllRepository(){
		return (List<RosberrypiData>) rr.findAll();
	}
	
	public RosberrypiData getRossberryPaiById(Long id) {
		return rr.findOne(id);
	}
	
	public RosberrypiData saveUpdate(RosberrypiData rd) {
		RosberrypiData rrd = rr.byName(rd.getRosberryName());
		if(rd != null)
	        return rrd;
		
		return rr.save(rd);
	}

	public RosberrypiData getByName(String name) {
		return rr.byName(name);
	}
	
}

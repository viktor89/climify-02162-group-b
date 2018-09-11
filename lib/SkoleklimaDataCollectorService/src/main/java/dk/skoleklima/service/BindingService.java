package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dk.skoleklima.model.BindingData;
import dk.skoleklima.repository.BindingRepository;

@Service("bindingService")
public class BindingService {
	
	@Autowired
	private BindingRepository br;
	
	public List<BindingData> ListAllBinding(){
		return (List<BindingData>) br.findAll();
	}
	
	public BindingData findOne(Long id) {
		return br.findOne(id);
	}

	public BindingData saveUpdate(BindingData bd) {
		return br.save(bd);
	}
}

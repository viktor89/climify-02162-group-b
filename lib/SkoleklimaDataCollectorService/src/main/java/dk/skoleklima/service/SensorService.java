package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import dk.skoleklima.model.RosberrypiData;
import dk.skoleklima.model.SensorData;
import dk.skoleklima.model.SensorLinkedItem;
import dk.skoleklima.repository.SensorRepository;

@Service("sensorservice")
public class SensorService {

	
	//lose-coupled(Dependency injection)
		@Autowired
		private SensorRepository srp;
		
		@Autowired
		private RosberryService rs;
		
		//we are not strong data in single bcz. our data is coming in the group from openhab.
		public void saveData(List<SensorData> dataList) {
			
		//	System.out.println( "Data : "+  (new Gson()).toJson(dataList));
			
			for(SensorData sd: dataList) {
				//System.out.println("into for sd loop "+sd.getUid());
				
				RosberrypiData rd = rs.getByName(sd.getRasberyPi().getRosberryName());
				if(rd != null)
					sd.setRasberyPi(rd);
				
				SensorData d = srp.selectBySensorUid(sd.getUid());
				//System.out.println("into for d "+sd.getSensorItemData());
				if(d == null && sd.getSensorItemData().size()>0) {
					//System.out.println("into d ");
					for(SensorLinkedItem si : sd.getSensorItemData()) 
						
						si.setSensordate(sd);
				   srp.save(sd);}
			}
			
		}
		
		public List<SensorData> listSensorDetails( ){
		
			return (List<SensorData>) srp.findAll();
        }
		
		public List<SensorData> listSensorDetailsByRosberryPai(Long id ){
			
			return srp.selectBySensorRosberrypai(id);
        }
		
        public SensorData findOne(Long id ){
			
			return srp.findOne(id);
        }
		
		public SensorData singleSaveUpdate(SensorData s) {
			return srp.save(s);
		}
		
}
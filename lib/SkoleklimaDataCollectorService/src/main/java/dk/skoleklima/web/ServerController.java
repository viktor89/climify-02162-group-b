package dk.skoleklima.web;

import java.util.ArrayList;
/*
 * Ctrl + Shift + O : Organize imports
 * Ctrl + / 		: Line Comment
 * Ctrl + E 		: Open Editor/Filter
 * Ctrl + O 		: Open declarations
 * F3 				: Open Declaration
 */
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import dk.skoleklima.model.BindingData;
import dk.skoleklima.model.ExtensionMaster;
import dk.skoleklima.model.RosberrypiData;
import dk.skoleklima.model.SchoolMaster;
import dk.skoleklima.model.SensorData;
import dk.skoleklima.model.SensorLinkedItem;
import dk.skoleklima.service.BindingService;
import dk.skoleklima.service.ExtensionService;
import dk.skoleklima.service.RosberryService;
import dk.skoleklima.service.SchoolService;
import dk.skoleklima.service.SensorLinkedItemService;
import dk.skoleklima.service.SensorService;
import dk.skoleklima.util.ChannelsDTO;
import dk.skoleklima.util.InfluxDbUtility;
import dk.skoleklima.util.SensorDTO;
import dk.skoleklima.utility.Url;

@RestController
@RequestMapping("/check")
public class ServerController {

	// @Autowired : Loose copling(Dependency injunction)
	//This ServerController class is responsible for exposing the endpoint for consumer(i.e Raspberry pi, Skolesklima dashboard).

	@Autowired
	SensorService ss;
	
	@Autowired
	BindingService bs;
	
	@Autowired
	RosberryService rs;
	
	@Autowired
	SensorLinkedItemService sl;
	
	@Autowired
	RosberryService rservice;
	
	@Autowired
	SchoolService sservice;
	
	@Autowired
	ExtensionService es;
	
//----------------------------------------------------------------------------	
// Saving raspberryPi influxDb data into the Skoleklima system influxDb. 
//----------------------------------------------------------------------------	
	//This end-point is consumed by raspberryPi client application in order to transfer the sensors data to the Skoleklima system.  
	@RequestMapping(value = "/sensor", method = RequestMethod.POST)
	public int restrictBySalesPrice(@RequestBody Map<Object,Map<Object, Map<Object,Object>>> listDataDto) {

		InfluxDbUtility idu = new InfluxDbUtility();
		idu.syncronizeData(listDataDto);
		//os.saveData(listDataDto); //Not saving in mysql
		return 200; //From here I'm sending '200' to the raspberry pi client by making it sure that data arrived successfully on the server.  
	}

	//---------------------------------------------------------------------
	// List out all the influxDb data based on the selected sensor name.
	//http://localhost:8085/check/sensors/netatmo-NAMain-9925bdbb-70ee502b59a6
	//---------------------------------------------------------------------
	@RequestMapping(value = "/sensors/{sensor}", method = RequestMethod.GET)
	public QueryResult sensorDataByName(@PathVariable("sensor") String id) {
		InfluxDB influxDB = InfluxDBFactory.connect(Url.serverInfluxDb, "openhab", "openhabuser");//server//windows
		Query query = new Query("SELECT * FROM \""+id+"\"", "openhab_db");
		return influxDB.query(query);
	//	return os.listOpenhabDataByName(id);
	}
	
	//---------------------------------------------------------------------------------------------------------------------------
	// Saving raspberryPi sensors, actuators metadata information into the Skoleklima system MariaDB.
	//Used by raspberryPi client application for transferring sensors, actuators metadata information to the Skoleklima system.
   //-----------------------------------------------------------------------------------------------------------------------------

	// Retrieving sensor metadata information from openhab and saving it to the mariadb. 
	// @PathVariable("sensor") String id
	@RequestMapping(value = "/sensorMetaData", method = RequestMethod.POST)
	public String saveSensorMetaData(@RequestBody List<SensorData> listSensorMetaDataDto) {
		ss.saveData(listSensorMetaDataDto);
		// System.out.println("listDataDto : "+listDataDto);
		return "OK";
	}
	
	
//------------------------------------------------------------------------------	
	// Get sensors details based on raspberryPi selection.
//------------------------------------------------------------------------------	
	@RequestMapping(value = "/sensordata/{rosbarrypai}", method = RequestMethod.GET)
	public List<SensorData> listSensor(@PathVariable("rosbarrypai") Long id){
		return ss.listSensorDetailsByRosberryPai(id);
	}
	
	//------------------------------------------------------------------------------	
		// Get all the sensors details. 
	//------------------------------------------------------------------------------	
	@RequestMapping(value = "/allsensordata", method = RequestMethod.GET)
	public List<SensorData> alllistSensor(){
		return ss.listSensorDetails();
	}
	
	//------------------------------------------------------------------------------	
		// Find sensor details by sensor id.
	//------------------------------------------------------------------------------
	@RequestMapping(value = "/sensordata/id/{sensorid}", method = RequestMethod.GET)
	public SensorData SensorById(@PathVariable("sensorid") Long id){
		return ss.findOne(id);
	}
	
	//RaspberryPi client app consuming this endpoint in order to send their sensors data. 
	@RequestMapping(value = "/sensordata", method = RequestMethod.POST)
	public String saveSensorData(@RequestBody SensorData sensorData) {
		   ss.singleSaveUpdate(sensorData)	 ;
		 return "done";
	}
	
	
	//----------------------------------------------------------------------------------------------
	//http://localhost:8085/check/binding
	//------------------------------------------------------------------------------	
		//List out all the bindings name from the openHAB.
	//------------------------------------------------------------------------------	
	@RequestMapping(value = "/binding", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	 public List<BindingData> findAllBindingData(){
	  return bs.ListAllBinding();
	 }
	 
	//------------------------------------------------------------------------------	
		// Get only selected binding by their name. 
	//------------------------------------------------------------------------------	
	 @RequestMapping(value = "/binding/id/{bindingid}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	 public BindingData bindingById(@PathVariable("bindingid") Long id){
	  return bs.findOne(id);
	 }
	 
//------------------------------------------------------------------------------	
		// RaspberryPi consuming this endpoint to send the bindings details. (not using at this moment it was just for initial test)
//------------------------------------------------------------------------------	
	 @RequestMapping(value = "/binding", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE) 
	 public String saveBindingData(@RequestBody BindingData bindingData) 
	 { 
	    bs.saveUpdate(bindingData); 
	    return "done"; 
	 }
	
	//------------------------------------------------------------------------------	
			// RaspberryPi consuming this endpoint to send the bindings details. (using not to store in a list)
	//------------------------------------------------------------------------------	 
	 //Saving binding data from raspberry pi. 
	 @RequestMapping(value = "/bindings", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	 public String saveBindingData(@RequestBody List<BindingData> listDataDto) {
	   for(BindingData b : listDataDto) {
		   System.out.println("description ======" + b.getDescription());
	       bs.saveUpdate(b);  
	   }
	   return "done";
	 }
	//----------------------------------------------------------------------------------------------
	//	http://localhost:8085/check/rosberryPi
		//-------------------- RaspberryPi---------------------------------------------------------
		
	  //List out all the raspberryPi
		@RequestMapping(value = "/rosberrypai", method = RequestMethod.GET)
		public List<RosberrypiData> findAllRosberryPi(){
			return rs.getAllRepository();
		}
		
		//saving raspberryPi details. 
		@RequestMapping(value = "/rosberrypai", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
		public String saveRosbarryPaiData(@RequestBody List<RosberrypiData> listDataDto) {
			 for(RosberrypiData b : listDataDto)
			     rs.saveUpdate(b);		 
			 return "done";
		}
		
		//update for existing raspberryPi details. (=========This is not working yet....suppose to have id in order to update the selected raspberryPi)
		@RequestMapping(value = "/rosberrypai", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
		public String saveRosbarryPaiData(@RequestBody RosberrypiData listDataDto) {
			  rs.saveUpdate(listDataDto);		 
			 return "done";
		}
		
		
		//selecting based on single raspberryPi. 
		@RequestMapping(value = "/rosberrypai/id/{rosberrypaiid}", method = RequestMethod.GET)
		public RosberrypiData rossberryById(@PathVariable("rosberrypaiid") Long id){
			return rs.getRossberryPaiById(id);
		}
		
   //----------------------------------------------------------------------------------------------
	//	http://localhost:8085/check/sensorlinkeditem
   //-------------------- sensorLinkedItem ---------------------------------------------------------
				
		//Listing all the sensors linked item from openHAB.
				@RequestMapping(value = "/sensorlinkeditem/{sensorId}", method = RequestMethod.GET)
				public List<SensorLinkedItem> findAllSensorItem(@PathVariable("sensor") Long sensorId){
					return sl.findItemBySensor(sensorId);
				}
	//	List out based on selected sensor id. 	
				@RequestMapping(value = "/sensorlinkeditem/id/{itemId}", method = RequestMethod.GET)
				public SensorLinkedItem sensorlinkeditemById(@PathVariable("itemId") Long id){
					return sl.findOne(id);
				}
				
	//This endpoint consumed by raspberryPi client application in order to sent the sensors linked item to the Skoleklima system.. 	
				@RequestMapping(value = "/sensorlinkeditem", method = RequestMethod.POST)
				public String savesensorlinkeditemData(@RequestBody List<SensorLinkedItem> listDataDto) {
					 for(SensorLinkedItem b : listDataDto)
					     sl.saveUdate(b);		 
					 return "done";
				}
				
				
//--------------------------------------------------------------------------------
				
				//using in web app in order to display the raspberyPi based on selected school details. 
				@RequestMapping(value = "/school/rass/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
				 public Set<RosberrypiData> rasberryBySchoolid(@PathVariable("id") Long id){
					SchoolMaster sm = sservice.oneSchool(id);
				  return sm.getRosberrypaidata();
				 }
				
				
				//search thermostat details based on thermostat search id.
				@RequestMapping(value = "/item/rass/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
				 public List<SensorLinkedItem> getThermostat(@PathVariable("id") Long id){
				  return sl.findByRassbery(id);
				 }
				
				
				
//------------------------ Bindings ----------------------------------------------------------------
				
				//this endpoint is consumed by raspberryPi client app. for sending the binding details. 
				@RequestMapping(value = "/extensionMetaData", method = RequestMethod.POST)
				public String saveExtension(@RequestBody List<ExtensionMaster> listEx) {
					  es.save(listEx);
					 return "done";
				}
				
				//List out all the available bindings. 
				@RequestMapping(value = "/extensionList", method = RequestMethod.GET)
				public List<ExtensionMaster> listNotInstalledExtension() {
					 return es.listAllExtension();
				}
				
				//List out all the installed bindings. 
				@RequestMapping(value = "/extensionInstalledList", method = RequestMethod.GET)
				public List<ExtensionMaster> listInstalledExtension() {
					 return es.listAllInstalledExtension();
				}

}

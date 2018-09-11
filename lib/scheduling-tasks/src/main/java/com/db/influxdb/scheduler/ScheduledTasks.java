package com.db.influxdb.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.db.influxdb.openhab.BraodcastBinding;
import com.db.influxdb.openhab.BroadcastSendorData;
import com.db.influxdb.openhab.OpenhabSensorMetaData;
import com.db.influxdb.openhab.influxdbConf;
/*=======================================================================================================================
 * Code Link                     : https://spring.io/guides/gs/scheduling-tasks/
 * Reference Link				 : https://www.callicoder.com/spring-boot-task-scheduling-with-scheduled-annotation/
 * Cron service generator link   : https://www.freeformatter.com/cron-expression-generator-quartz.html#cronconverttotext
 * ======================================================================================================================
 * @Scheduled : annotation defines when a particular method runs i.e below method will run in every 5 seconds. 
 * fixedRate  : specifies the interval between method invocations measured from the start time of each invocation. 
 */
@Component
public class ScheduledTasks {
	
    //private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
	 //private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");

         
    //@Scheduled(cron = "0 */5 * ? * *")// every 5-minutes.
	@Scheduled(cron = "*/5 * * * * *")//Every 5 -seconds
    public void reportSchedulleForMetaData() {
    	OpenhabSensorMetaData dataScheduler = new OpenhabSensorMetaData();
    	System.out.println("Aadfasdfasdfasd");    	
    	dataScheduler.getMetaDataInfo();
   
    }
 
    //@Scheduled(cron = "*/5 * * * * *")//Every 5 -seconds.
    //@Scheduled(cron = "0 */5 * ? * *")// every 5-minutes.
    public void reportSchedulledData() {
    	influxdbConf inconf = new influxdbConf();
    	inconf.getData(); 	
   }
    
    @Scheduled(cron = "0 */7 * ? * *")// every 7-minutes.
   // @Scheduled(cron = "*/5 * * * * *")//Every 5 -seconds
    public void reportBindinData() {
    		BraodcastBinding bb = new BraodcastBinding();
    		bb.sendBinding();
   }
    
   // @Scheduled(cron = "0 */6 * ? * *")// every 6-minutes.
    @Scheduled(cron = "*/5 * * * * *")//Every 5 -seconds
    public void reportSensorData() {
    	BroadcastSendorData bsd = new BroadcastSendorData();
    	bsd.getMetaDataInfo();
   }
    
}

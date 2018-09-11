package dk.skoleklima.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@SuppressWarnings("serial")
@Entity
public class RoleTable implements Serializable{

	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "role_id", unique = true, nullable = false)
	private Long id;

	private String 	roleName;
	private boolean createNewUser=false;
	private boolean activateDeactivate=true;
	private boolean createRole=false;
	private boolean assignRole=false;
	/**
	 * @return the assignRole
	 */
	public boolean isAssignRole() {
		return assignRole;
	}
	/**
	 * @param assignRole the assignRole to set
	 */
	public void setAssignRole(boolean assignRole) {
		this.assignRole = assignRole;
	}
	private boolean changePermission=false;
	private boolean provideAccessPrivilage=false;
	private boolean addLocationToDevice=false;
	private boolean viewDeviceDetails=true;
	private boolean updateDeviceLocation=false;
	private boolean viewDeviceValue=true;
	private boolean controlThermostat=false;
	private boolean viewDataHistory=true;
	private boolean addNewDevice=false;
	private boolean removeSensorsActuators=false;
	private boolean addNewItems=false;
	private boolean removeExistingItems=false;
	private boolean visualizeDeviceData=false;
	
		
	/**
	 * @return the removeSensorsActuators
	 */
	public boolean isRemoveSensorsActuators() {
		return removeSensorsActuators;
	}
	/**
	 * @param removeSensorsActuators the removeSensorsActuators to set
	 */
	public void setRemoveSensorsActuators(boolean removeSensorsActuators) {
		this.removeSensorsActuators = removeSensorsActuators;
	}
	/**
	 * @return the addNewItems
	 */
	public boolean isAddNewItems() {
		return addNewItems;
	}
	/**
	 * @param addNewItems the addNewItems to set
	 */
	public void setAddNewItems(boolean addNewItems) {
		this.addNewItems = addNewItems;
	}
	/**
	 * @return the removeExistingItems
	 */
	public boolean isRemoveExistingItems() {
		return removeExistingItems;
	}
	/**
	 * @param removeExistingItems the removeExistingItems to set
	 */
	public void setRemoveExistingItems(boolean removeExistingItems) {
		this.removeExistingItems = removeExistingItems;
	}
	/**
	 * @return the visualizeDeviceData
	 */
	public boolean isVisualizeDeviceData() {
		return visualizeDeviceData;
	}
	/**
	 * @param visualizeDeviceData the visualizeDeviceData to set
	 */
	public void setVisualizeDeviceData(boolean visualizeDeviceData) {
		this.visualizeDeviceData = visualizeDeviceData;
	}
	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * @return the roleName
	 */
	public String getRoleName() {
		return roleName;
	}
	/**
	 * @param roleName the roleName to set
	 */
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	/**
	 * @return the createNewUser
	 */
	public boolean isCreateNewUser() {
		return createNewUser;
	}
	/**
	 * @param createNewUser the createNewUser to set
	 */
	public void setCreateNewUser(boolean createNewUser) {
		this.createNewUser = createNewUser;
	}
	/**
	 * @return the activateDeactivate
	 */
	public boolean isActivateDeactivate() {
		return activateDeactivate;
	}
	/**
	 * @param activateDeactivate the activateDeactivate to set
	 */
	public void setActivateDeactivate(boolean activateDeactivate) {
		this.activateDeactivate = activateDeactivate;
	}
	/**
	 * @return the createRole
	 */
	public boolean isCreateRole() {
		return createRole;
	}
	/**
	 * @param createRole the createRole to set
	 */
	public void setCreateRole(boolean createRole) {
		this.createRole = createRole;
	}
	/**
	 * @return the changePermission
	 */
	public boolean isChangePermission() {
		return changePermission;
	}
	/**
	 * @param changePermission the changePermission to set
	 */
	public void setChangePermission(boolean changePermission) {
		this.changePermission = changePermission;
	}
	/**
	 * @return the provideAccessPrivilage
	 */
	public boolean isProvideAccessPrivilage() {
		return provideAccessPrivilage;
	}
	/**
	 * @param provideAccessPrivilage the provideAccessPrivilage to set
	 */
	public void setProvideAccessPrivilage(boolean provideAccessPrivilage) {
		this.provideAccessPrivilage = provideAccessPrivilage;
	}
	/**
	 * @return the addNewDevice
	 */
	public boolean isAddNewDevice() {
		return addNewDevice;
	}
	/**
	 * @param addNewDevice the addNewDevice to set
	 */
	public void setAddNewDevice(boolean addNewDevice) {
		this.addNewDevice = addNewDevice;
	}
	/**
	 * @return the addLocationToDevice
	 */
	public boolean isAddLocationToDevice() {
		return addLocationToDevice;
	}
	/**
	 * @param addLocationToDevice the addLocationToDevice to set
	 */
	public void setAddLocationToDevice(boolean addLocationToDevice) {
		this.addLocationToDevice = addLocationToDevice;
	}
	/**
	 * @return the viewDeviceDetails
	 */
	public boolean isViewDeviceDetails() {
		return viewDeviceDetails;
	}
	/**
	 * @param viewDeviceDetails the viewDeviceDetails to set
	 */
	public void setViewDeviceDetails(boolean viewDeviceDetails) {
		this.viewDeviceDetails = viewDeviceDetails;
	}
	/**
	 * @return the updateDeviceLocation
	 */
	public boolean isUpdateDeviceLocation() {
		return updateDeviceLocation;
	}
	/**
	 * @param updateDeviceLocation the updateDeviceLocation to set
	 */
	public void setUpdateDeviceLocation(boolean updateDeviceLocation) {
		this.updateDeviceLocation = updateDeviceLocation;
	}
	/**
	 * @return the viewDeviceValue
	 */
	public boolean isViewDeviceValue() {
		return viewDeviceValue;
	}
	/**
	 * @param viewDeviceValue the viewDeviceValue to set
	 */
	public void setViewDeviceValue(boolean viewDeviceValue) {
		this.viewDeviceValue = viewDeviceValue;
	}
	/**
	 * @return the controlThermostat
	 */
	public boolean isControlThermostat() {
		return controlThermostat;
	}
	/**
	 * @param controlThermostat the controlThermostat to set
	 */
	public void setControlThermostat(boolean controlThermostat) {
		this.controlThermostat = controlThermostat;
	}
	/**
	 * @return the viewDataHistory
	 */
	public boolean isViewDataHistory() {
		return viewDataHistory;
	}
	/**
	 * @param viewDataHistory the viewDataHistory to set
	 */
	public void setViewDataHistory(boolean viewDataHistory) {
		this.viewDataHistory = viewDataHistory;
	}

}

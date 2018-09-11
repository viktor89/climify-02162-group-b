package dk.skoleklima.web;

import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import dk.skoleklima.model.RoleTable;
import dk.skoleklima.model.SensorData;
import dk.skoleklima.model.User;
import dk.skoleklima.service.RoleService;
import dk.skoleklima.service.RosberryService;
import dk.skoleklima.service.SchoolService;
import dk.skoleklima.service.SensorService;
import dk.skoleklima.service.UserService;

@Controller
public class WebController {
	
	@Autowired
	private RoleService rs;
	
	@Autowired
	private RosberryService rosService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private SchoolService service;
	
	@Autowired
	private SensorService sensorService;
	
  //---------------------- login/ logout ---------------- 
	
	@RequestMapping({"/","/login"})
    public String login() {
        return "login";
    }
	
	@RequestMapping("/dashboard")
    public String dashboard(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
        return "dashboard";
		}
		else
			return "redirect:/";
    }
	//Skoleklima user signs in. ---POST
	@PostMapping("/login")
    public String greeting(HttpServletRequest request, HttpServletResponse response,@RequestParam(name="username", required=true) String username,@RequestParam(name="password", required=true) String password, Model model) {
        
		User u = userService.login(username, password);
		
		if(u != null) {
		request.getSession().setAttribute("username",u.getName());
		request.getSession().setAttribute("luser", u);
        model.addAttribute("name", request.getSession().getAttribute("username"));
        return "dashboard";
		}
		else
			return "redirect:/";
    }
	
	//Skoleklima user signs out. ---GET

	@RequestMapping("/logout")
    public String logout(HttpServletRequest request) throws ServletException {
    	request.getSession().invalidate();
        return "redirect:/";
    }
	
	//-------------------------- roles --------------------------------------
	
	//List out the roles details. ---GET
	@RequestMapping("/roles")
    public ModelAndView listrole(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		List<RoleTable> lr = rs.ListAllRole();
		
		ModelAndView modelv = new ModelAndView("listroles");
		modelv.addObject("lroles", lr);
        return modelv;
		}
		else
			return new ModelAndView("redirect:/");
    }
	
	//Add roles. Display in browser page ---GET
	@RequestMapping("/addrole")
    public String addroles(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		model.addAttribute("ro", new RoleTable());
        return "addrole";
		}
		else
			return "redirect:/";
    }
	//Edit existing role. ---PUT
	@RequestMapping("/editrole/{id}")
    public String addrole(HttpServletRequest request, HttpServletResponse response,@PathVariable("id") Long roleid,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		RoleTable rol = rs.findOne(roleid);
		model.addAttribute("ro", rol);
        return "addrole";
		}
		else
			return "redirect:/";
    }
	//For saving the roles in db   ---POST
	@PostMapping("/saveroles")
    public String saveUpdate(HttpServletRequest request, HttpServletResponse response,@ModelAttribute("roletable")RoleTable rtable) {
		if(request.getSession().getAttribute("username")!=null) {
		  rs.saveUpdate(rtable);
        return "redirect:/roles";
		}
		else
			return "redirect:/";
    }
	
	
	//-------------------------- users--------------------------------------
	
	//list out all the registered users. ---GET
	@RequestMapping("/users")
    public String listusers(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		model.addAttribute("usersList", userService.findAllUser());
        return "user_list";//Match corresponding view. 
		}
		else
			return "redirect:/";
    }
	
	//Add new user into the Skoleklima system. ---POST
	@RequestMapping("/add_user")
    public String adduser(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		model.addAttribute("newuser", new User());
		model.addAttribute("rolesItem", rs.ListAllRole());
		model.addAttribute("rossItem", service.listSchool());
        return "add_user";
		}
		else
			return "redirect:/";
    }
	
	//Edit existing user based on their id. ---PUT
	@RequestMapping("/edituser/{id}")
    public String edituser(HttpServletRequest request, HttpServletResponse response,@PathVariable("id") Long userid,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		User us = userService.findById(userid);
		model.addAttribute("newuser", us);
		model.addAttribute("rolesItem", rs.ListAllRole());
		model.addAttribute("rossItem", service.listSchool());
        return "add_user";
		}
		else
			return "redirect:/";
    }
	//Save it to in db    ---POST
	@PostMapping("/saveuser")
    public String saveUpdateUser(HttpServletRequest request, HttpServletResponse response,@ModelAttribute("newuser")User user) {
		if(request.getSession().getAttribute("username")!=null) {
		  userService.saveAndUpdateUser(user);
        return "redirect:/users";
		}
		else
			return "redirect:/";
    }
	
	//Delete existing user based on their id. ---DELETE
	@GetMapping("/deleteuser/{id}")
    public String deleteUser(HttpServletRequest request, HttpServletResponse response,@PathVariable("id") Long userid,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		  userService.deleteUser(userid);
        return "redirect:/users";
		}
		else
			return "redirect:/";
    }
	
	//-------------------------- control actuators--------------------------------------
	//Control actuators set points.   ---POST
	@RequestMapping("/control_set_point")//Match corresponding view. 
    public String controlThermostatPoint(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		model.addAttribute("school", service.listSchool());
		return "control_set_point";
		}
		else
			return "redirect:/";
    }

	
	// -------------------------- binding detail ------------------------------
	//List out all the available bindings details from the openHAB.    ---GET
	@RequestMapping("/listbinding")//Match corresponding view. 
    public String listInstalledBinding(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		model.addAttribute("school", service.listSchool());
		return "listbinding";
		}
		else
			return "redirect:/";
    }

	
	
	//-------------------------- device metadata--------------------------------------
	
	//List out all the device metadata information.  ----GET
	@RequestMapping("/device_metadata")
    public String deviceMetaData(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		
        return "device_metadata"; 
		}
		else
			return "redirect:/";
    }
	
	
	//Get Single sensor metadeta.
		@GetMapping("/metadata/{id}")
	    public String metadataById(HttpServletRequest request, HttpServletResponse response,@PathVariable("id") Long id,Model model) {
			if(request.getSession().getAttribute("username")!=null) {
				
				SensorData sd = sensorService.findOne(id) ;
				model.addAttribute("sdata", sd);
			              
	        return "sensormetadata";
			}
			else
				return "redirect:/";
	    }
		
		
		//Save it to in db    ---POST
		@PostMapping("/updateSensorAddress")
	    public String updateSensorAddress(HttpServletRequest request, HttpServletResponse response,@ModelAttribute("sdata")SensorData sd) {
			if(request.getSession().getAttribute("username")!=null) {
				SensorData s = sensorService.findOne(sd.getId());
				s.setAddress(sd.getAddress());
			  sensorService.singleSaveUpdate(s);
	        return "redirect:/device_metadata";
			}
			else
				return "redirect:/";
	    }
	
	
	//-------------------------- device management--------------------------------------
	//Manage all the devices for example add new sensors, remove existing sensors. ---GET
	@RequestMapping("/deviceManagement")
    public String deviceManagements(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		
        return "deviceManagement"; 
		}
		else
			return "redirect:/";
    }
	
	//-------------------------- add new device on the openHAB--------------------------------------
	
	//Add new device on the openHAB. --- POST
		@RequestMapping("/addNewDevice")
	    public String addNewDeviceOpenaHab(HttpServletRequest request, HttpServletResponse response,Model model) {
			if(request.getSession().getAttribute("username")!=null) {
			model.addAttribute("name", request.getSession().getAttribute("username"));
			
	        return "addNewDevice"; 
			}
			else
				return "redirect:/";
	    }
		
		//-------------------------- remove existing device from the openHAB--------------------------------------
		
		//Remove existing device from the openHAB. ---DELETE
		@RequestMapping("/removeDevice")
	    public String removeDeviceOpenHab(HttpServletRequest request, HttpServletResponse response,Model model) {
			if(request.getSession().getAttribute("username")!=null) {
			model.addAttribute("name", request.getSession().getAttribute("username"));
			
	        return "removeDevice"; 
			}
			else
				return "redirect:/";
	    }
	
	//-------------------------- sensor data--------------------------------------
		
		//List out all the sensors details based on school details.  ---GET
		@RequestMapping("/sensors_data")
	    public String sensorData(HttpServletRequest request, HttpServletResponse response,Model model) {
			if(request.getSession().getAttribute("username")!=null) {
			model.addAttribute("name", request.getSession().getAttribute("username"));
			model.addAttribute("school", service.listSchool());
	        return "sensors_data"; 
			}
			else
				return "redirect:/";
	    }
	
	//-------------------------- add device location--------------------------------------
		
	//Add location details to the existing device.  --- POST
	@RequestMapping("/add_device_location")
    public String addDeviceLocation(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
        return "add_device_location"; 
		}
		else
			return "redirect:/";
    }
}

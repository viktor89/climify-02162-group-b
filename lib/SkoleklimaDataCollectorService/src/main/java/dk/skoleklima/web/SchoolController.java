package dk.skoleklima.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import dk.skoleklima.model.RoleTable;
import dk.skoleklima.model.SchoolMaster;
import dk.skoleklima.service.RoleService;
import dk.skoleklima.service.RosberryService;
import dk.skoleklima.service.SchoolService;
import dk.skoleklima.service.UserService;

//HTTP methods : (Post- create, Get- read, Put-update, Delete-delete)

@Controller
public class SchoolController {
	@Autowired
	private RoleService rs;
	
	@Autowired
	private RosberryService rosService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private SchoolService service;
	
	//List out all the registered school details ---GET	
	@RequestMapping("/listschool")
    public ModelAndView listrole(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		List<SchoolMaster> lr = service.listSchool();
		ModelAndView modelv = new ModelAndView("listschool");
		modelv.addObject("lschool", lr);
        return modelv;
		}
		else
			return new ModelAndView("redirect:/");
    }
	
	//Edit existing school details based on selected school name. ---PUT
	@RequestMapping("/editschool/{id}")
    public String editschool(HttpServletRequest request, HttpServletResponse response,@PathVariable("id") Long id,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		SchoolMaster sm = service.oneSchool(id);
		model.addAttribute("ro", sm);
        return "schoolmaster";
		}
		else
			return "redirect:/";
    }
	
	//Add new school form load. (load model) -----GET
	@RequestMapping("/addschool")
    public String addroles(HttpServletRequest request, HttpServletResponse response,Model model) {
		if(request.getSession().getAttribute("username")!=null) {
		model.addAttribute("name", request.getSession().getAttribute("username"));
		model.addAttribute("ro", new SchoolMaster());
		model.addAttribute("rossItem", rosService.getAllRepository());
        return "schoolmaster";
		}
		else
			return "redirect:/";
    }
	
	//Saving school in db ---POST
	@PostMapping("/saveschool")
    public String saveUpdate(HttpServletRequest request, HttpServletResponse response,@ModelAttribute("ro")SchoolMaster smaster) {
		if(request.getSession().getAttribute("username")!=null) {
		 service.saveSchool(smaster);
        return "redirect:/listschool";
		}
		else
			return "redirect:/";
    }

}

package dk.skoleklima.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dk.skoleklima.model.User;
import dk.skoleklima.repository.UserRepository;

@Service("userService")
public class UserService {
	
	@Autowired
	private UserRepository userrepo;
	
	public List<User> findAllUser(){
		return (List<User>) userrepo.findAll();
	}
	
	public User findById(Long id){
		return  userrepo.findOne(id);
	}
	
	public User saveAndUpdateUser(User user){
		return  userrepo.save(user);
	}
	
	public void deleteUser(Long id){
		  userrepo.delete(id);
	}
	
	public User login(String email, String password) {
		return userrepo.authrizeLogin(email, password);
	}

}

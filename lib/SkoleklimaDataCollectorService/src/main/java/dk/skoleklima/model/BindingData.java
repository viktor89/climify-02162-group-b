package dk.skoleklima.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
/*
 * Spring data JPA using Hibernate.
 * 		
 * STEP 1: 
 * ----------------------------------------------
 * This class is also called a POJO. 
 * @Entity : This annotation indicates that the class is mapped to a database table.
 * @Id     : Map id field to the primary key.
 * 
 */

@Entity
public class BindingData implements Serializable {

//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Column(name = "id", unique = true, nullable = false)
	

	private static final long serialVersionUID = 4736084920333148509L;

	@Id
	@Column(name = "id")
	private String id;
	
	private String name;
	@Column(columnDefinition = "TEXT")
	private String description;
	private String author;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	

}

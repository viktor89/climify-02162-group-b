<?php 

//************************************************
//	Get Companyes
//************************************************


require_once "../admin-meta.php";
require_once "../session.php";

$phaseSessionToken = clean($_POST[sessionToken]);

if( $phaseSessionToken != $adminSessionToken ){
    echo '{"status":"error"}';
    exit;
}

if (!$systemAccess) {
    echo '{"status":"error"}';
    exit;
}

$phaseStatus=clean($_POST["status"]); //Blocked
$phaseSearch=clean($_POST["search"]);

if (!in_array($phaseStatus, array("0","1","2"), true )) {
    echo '{"status": "error"}';
    exit;
}

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;
$pepper = HASH_PEPPER;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

//echo "phaseStatus " . $phaseStatus . " seach " . $phaseSearch;

if ($phaseStatus == "2") {
    
    if ($phaseSearch == "") {
        $stmt = $conn->prepare("(SELECT * FROM ProjectManager NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone NATURAL JOIN Address NATURAL                           JOIN Zip ORDER BY MunName DESC)
                                UNION
                                (SELECT * FROM ProjectManagerActivate NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone NATURAL JOIN Address NATURAL JOIN Zip ORDER BY MunName DESC);");
    } else {
        $stmt = $conn->prepare("(SELECT * FROM ProjectManager NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone NATURAL JOIN Address NATURAL                           JOIN Zip
                                WHERE (MunName LIKE ? OR FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR PhoneNumber LIKE ?)
                                ORDER BY MunName DESC)
                                UNION
                                (SELECT * FROM ProjectManagerActivate NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone NATURAL JOIN Address NATURAL JOIN Zip
                                WHERE (MunName LIKE ? OR FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR PhoneNumber LIKE ?)
                                ORDER BY MunName DESC)");
        $param = "%$phaseSearch%";
        $stmt->bind_param("sssss", $param, $param, $param, $param, $param);    
    }
    
    


    
    
    
    //NÅET HERTIL:
} else if (in_array($phaseStatus, array("0","1"), true )) {
    if ($phaseSearch == "") {
        $stmt = $conn->prepare("(SELECT * FROM ProjectManager NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone NATURAL JOIN Address NATURAL                          JOIN Zip
                                WHERE Blocked = ?
                                ORDER BY MunID DESC)
                                UNION
                                (SELECT * FROM ProjectManagerActivate NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone NATURAL JOIN Address NATURAL JOIN Zip
                                WHERE Blocked = ?
                                ORDER BY MunID DESC)");
        
        $stmt->bind_param("s", $phaseStatus); 
    } else {
        $stmt = $conn->prepare("(SELECT * FROM ProjectManager NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone
                                WHERE Blocked = ?
                                AND (MunName LIKE ? OR FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR PhoneNumber LIKE ?)
                                ORDER BY MunName DESC)
                                UNION
                                (SELECT * FROM ProjectManagerActivate NATURAL JOIN Municipality NATURAL JOIN Person NATURAL JOIN Phone
                                WHERE Blocked = ?
                                AND (MunName LIKE ? OR FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR PhoneNumber LIKE ?)
                                ORDER BY MunName DESC)");
        $param = "%$phaseSearch%";
        $stmt->bind_param("ssssss", $phaseStatus, $param, $param, $param, $param, $param, $param);    
    }
} 

$stmt->execute();

$result = $stmt->get_result();

$emparray = array();
while($row = mysqli_fetch_assoc($result))
{
    $emparray[] = $row;
}

$messages = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $messages;

$stmt->close();

$conn->close();   

?>
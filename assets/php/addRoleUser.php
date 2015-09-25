<?php  
 $url = 'https://api.parse.com/1/roles/h6yJXJOppS';  
 $headers = array(  
   "Content-Type: application/json",  
   "X-Parse-Application-Id: xNpnl6Xip8R9V3Vdsn54zFT9yIfTIcd8BuvNKFNw",  
   "X-Parse-Master-Key: K9Zk3Y3o9rfKfUi0nYQZGLHAK8fktC3P0z1LNkeM"
 );  
 $objectData = '{"users":{"__op": "AddRelation","objects": [{"__type": "Pointer","className": "_User","objectId": "DpaS68KK4e"}]}}';

 $rest = curl_init();  
 curl_setopt($rest,CURLOPT_URL,$url);  
 curl_setopt($rest, CURLOPT_CUSTOMREQUEST, "PUT");
 curl_setopt($rest,CURLOPT_POSTFIELDS,$objectData);  
 curl_setopt($rest,CURLOPT_HTTPHEADER,$headers);  
 curl_setopt($rest,CURLOPT_SSL_VERIFYPEER, false);  
 curl_setopt($rest,CURLOPT_RETURNTRANSFER, true);  
 $response = curl_exec($rest);  
 echo $response;  
 print_r($response);  
 curl_close($rest);  
 ?> 
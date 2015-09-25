<?php
$tempDir = '../files';
if (!file_exists($tempDir)) {
	mkdir($tempDir);
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	$chunkDir = $tempDir . DIRECTORY_SEPARATOR . $_GET['flowIdentifier'];
	$chunkFile = $chunkDir.'/chunk.part'.$_GET['flowChunkNumber'];
	if (file_exists($chunkFile)) {
		header("HTTP/1.0 200 Ok");
	} else {
		header("HTTP/1.1 204 No Content");
	}
}

if($_FILES["file"]["name"]) {
    $filename = $_FILES["file"]["name"];
    $source = $_FILES["file"]["tmp_name"];
    $type = $_FILES["file"]["type"];
    
    $name = explode(".", $filename);
    $accepted_types = array('application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed');
    foreach($accepted_types as $mime_type) {
        if($mime_type == $type) {
            $okay = true;
            break;
        } 
    }
    
    $continue = strtolower($name[1]) == 'zip' ? true : false;
    if(!$continue) {
        $message = "The file you are trying to upload is not a .zip file. Please try again.";
    }

    $filenamekey = md5(uniqid($filename, true));

    $target_path_folder = "../files/" . $filenamekey;
    $target_path = "../files/" . $filenamekey;  // change this to the correct site path
    if (!file_exists($target_path)) {
        mkdir($target_path, 0777, true);
    }
    $target_path .= $filename;
    if(move_uploaded_file($source, $target_path)) {
        $zip = new ZipArchive();
        $x = $zip->open($target_path);
        if ($x === true) {
            $zip->extractTo($target_path_folder); // change this to the correct site path
            $zip->close();
    
            unlink($target_path);
        }
        $message = json_encode(array('state' => 'true', 'folder' => $filenamekey));
    } else {    
        $message = "There was a problem with the upload. Please try again.";
    }


    echo $message;
}

<?php
	header('Content-type: text/plain; charset=utf-8');
    
	$galeries = '../../galeries';
	$clusters_data = array();
	$cluster_folders = glob("$galeries/*", GLOB_ONLYDIR);
	
	if(count($cluster_folders) > 0){
		foreach ($cluster_folders as $cluster_folder){
			$cluster = new stdClass();
			$cluster->name = utf8_encode(pathinfo($cluster_folder, PATHINFO_FILENAME));
			$cluster_themes = glob("$cluster_folder/*", GLOB_ONLYDIR);
			if(count($cluster_themes) > 0){
				$cluster->theme = array()	;
				foreach ($cluster_themes as $cluster_theme){
					$theme = new stdClass();			
					$theme->name = utf8_encode(pathinfo($cluster_theme, PATHINFO_FILENAME));
					$theme->file_time = utf8_encode(date("F Y", filemtime($cluster_theme)));
					$media_themes = glob("$cluster_theme/*.*");			
					if(count($media_themes) > 0){	
						$theme->medium = array();
						foreach ($media_themes as $medium_theme){
							$file_extension = pathinfo($medium_theme, PATHINFO_EXTENSION);
							if(($file_extension == "jpg") || ($file_extension == "jpeg") || ($file_extension == "JPG") || ($file_extension == "JPEG")){
								$medium = new stdClass();
								$pathinfo = pathinfo($medium_theme);
								$medium->caption = utf8_encode($pathinfo['filename']);
								$medium->path = utf8_encode(str_replace("../../","", $medium_theme));
								$theme->medium[] = $medium;
							}
						}
					}
					$cluster->theme[] = $theme;
				}
			}
			$clusters_data[] = $cluster;
		}
	}
	echo json_encode($clusters_data);
?>
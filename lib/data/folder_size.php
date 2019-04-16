<?php
	header("Content-Type: application/xml; charset=utf-8");
	
	/*
    $galeries = '../../galeries';
    $io = popen ( '/usr/bin/du -sk ' . $galeries, 'r' );
    $size = fgets ( $io, 4096);
    $size = substr ( $size, 0, strpos ( $size, "\t" ) );
    pclose ( $io );
	echo ($size);
	echo "yes";
	*/
	
	$f = 'E:/MAMP/htdocs/comboard';
    $obj = new COM ( 'scripting.filesystemobject' );
    if ( is_object ( $obj ) )
    {
        $ref = $obj->getfolder ( $f );
        echo $ref->size;
        $obj = null;
    }
    else
    {
        echo 'can not create object';
    }
?>
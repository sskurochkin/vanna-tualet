<?php

class HTTP {
	
	static public function redirectTo($URL)
	{
		self::sendHeader('Location', HTTP_PATH.$URL);
		exit;
	}
	
	static public function sendHeader($name, $value = NULL)
	{
		header($name.(!is_null($value) ? ': '.$value : ''));
	}
	
	static public function _GP($name, $default, $multibyte = false, $highnum = false)
	{
		if(!isset($_REQUEST[$name]))
		{
			return $default;
		}
		
		if(is_int($default))
		{
			return (int) $_REQUEST[$name];			
		}
		
		if(is_float($default))
		{
			return (float) $_REQUEST[$name];			
		}
		
		if(is_string($default))
		{
			
			$vars = str_replace(array("\r\n", "\r", "\0"), array("\n", "\n", ''), $_REQUEST[$name]);
			// 	проверяем на массив
			if(!is_array($vars))
				$var = trim(htmlspecialchars($vars, ENT_QUOTES, 'UTF-8'));
			
			if (empty($var)) {
				return $default;				
			}
			
			if ($multibyte) {
				if (!preg_match('/^./u', $var)) {
					$var = '';
				}
			} else {
				$var = preg_replace('/[\x80-\xFF]/', '?', $var); // no multibyte, allow only ASCII (0-127)
			}
			
			return $var;
		}
		
		if(is_array($default))
		{
			return (array) $_REQUEST[$name];
		}
		
		return $default;
	}
	
	//-- Миссив чисел
	static public function _GPA($name, $unsigned = true)
	{
		if(!isset($_REQUEST[$name]))
			return array();
			
		$varArray		= array();
	
		foreach((array) $_REQUEST[$name] as $key => $subdefault)
		{
			$varArray[$key] = (int) preg_replace("/[^0-9]/", '', $subdefault);
			
			if($unsigned)
				$varArray[$key] = max(0,$varArray[$key]);
			
		}

		return $varArray;
	}
}